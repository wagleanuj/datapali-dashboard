const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const { AuthorizationErrorsCodes, MailerErrorCodes } = require("../../error_defs/index");
const { ApolloError, AuthenticationError, UserInputError } = require("apollo-server-express");
const { User } = require('../../models/user');
const { ResetToken } = require("../../models/resetTokens");
const { FilledForm } = require("../../models/filledForm");
const { FormFile } = require("../../models/form");


const { PasswordResetTemplate } = require("../../email_templates/passwordReset");
const SALT_WORK_FACTOR = 10;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD
    }
});

const resolvers = {
    Query: {
        login: (parent, { email, password }, context, info) => {
            let findUserPromise_ = User.findOne({ email: email }).populate("createdForms").populate("availableForms").populate("filledForms").exec();
            return findUserPromise_.then(user => {
                if (!user) throw new ApolloError("User with the email not found", AuthorizationErrorsCodes.USER_WITH_GIVEN_EMAIL_NOT_FOUND, { username: usernameOrEmail });
                return new Promise((resolve, reject) => {
                    bcrypt.compare(password, user.password, async (err, result) => {
                        if (err) reject(new AuthenticationError("Incorrect password"));
                        if (result === true) {
                            const token = jwt.sign({
                                email: user.email,
                                accountType: user.accountType,
                            }, process.env.JWT_SECRET, {
                            });
                            console.log(user._doc.filledForms);
                            resolve({ user: user._doc, token: token });
                        } else {
                            reject(new AuthenticationError("Incorrect password"));
                        }
                    })
                })

            })
        },
        sendPasswordResetEmail: (parent, args, context, info) => {
            return User.findOne({ email: args.email }).exec().then((user) => {
                if (!user) {
                    throw new ApolloError(AuthorizationErrorsCodes.USER_WITH_GIVEN_EMAIL_NOT_FOUND);
                }
                const payload = {
                    user: user.username,
                    email: user.email,
                    subject: "change_password",
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });
                let resetLink = `http://${process.env.NODE_ENV === "development" ? "localhost" : "138.197.164.101"}:${process.env.SERVER_PORT}/reset-password?token=${token}`;
                const mailOptions = {
                    from: process.env.MAILER_USERNAME,
                    to: user.email,
                    subject: "Reset Password",
                    html: PasswordResetTemplate(user.username, resetLink)
                };
                return new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (err, response) => {
                        if (err) reject(new ApolloError("Failed to send the password reset email", MailerErrorCodes.FAILED_TO_SEND_EMAIL, { email: user.email }));
                        //save the reset token to the database 
                        let resetToken = new ResetToken({
                            token: token
                        });
                        resetToken.save().then(result => {
                            resolve({ message: "Email successfully sent" });
                        });
                    });
                });
            });
        }
    },
    Mutation: {
      
        register: async (parent, { user }, context, info) => {
            let { email, firstName, lastName, accountType, password, createdBy } = user;
            let referredBy = undefined;
            if (accountType === "surveyor") {
                referredBy = await User.findById(createdBy).exec();
                if (!referredBy || referredBy.accountType !== "admin") throw new ApolloError("Admin must refer a surveyor");
            }
            return User.findOne({ email: email }).exec().then((user, err) => {
                if (user) throw new ApolloError("User already exists", AuthorizationErrorsCodes.EMAIL_ALREADY_EXISTS, { email: email });
                return new Promise((resolve, reject) => {
                    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                        if (err) reject(new ApolloError("Failed to generate salt", AuthorizationErrorsCodes.BCRYPT_ERROR, {}));
                        bcrypt.hash(password, salt, null, async (err, hash) => {
                            if (err) reject(new ApolloError("Failed to hash password", AuthorizationErrorsCodes.BCRYPT_ERROR, {}));
                            password = hash;
                            const newUser = new User({
                                email: email,
                                password: password,
                                firstName: firstName,
                                lastName: lastName,
                                accountType: accountType,
                            });
                            if (accountType === "surveyor") {
                                newUser.filledForms = [];
                                newUser.availableForms = [];
                                newUser.createdBy = referredBy._id;
                            } else if (accountType === "admin") {
                                newUser.createdForms = [];
                            }
                            let result = await newUser.save();
                            resolve({ ...result._doc, surveyorCode: newUser._id.toString() });
                        })
                    })
                })
            });
        },
        resetUserPassword: (parent, { email, password, token }, context, info) => {
            let foundUser = null;
            return User.findOne({ email: email }).exec().then(user => {
                if (!user) throw new ApolloError("User not found", AuthorizationErrorsCodes.USER_WITH_GIVEN_EMAIL_NOT_FOUND);
                foundUser = user;
                return ResetToken.findOne({ token: token }).exec();
            }).then(foundToken => {
                if (!foundToken) throw new ApolloError("Invalid password reset token", AuthorizationErrorsCodes.INVALID_PASSWORD_RESET_TOKEN);
                let decoded;
                try {
                    decoded = jwt.verify(token, process.env.JWT_SECRET);
                }
                catch (err) {
                    foundToken.remove();
                    throw new ApolloError("Invalid password reset token", AuthorizationErrorsCodes.INVALID_PASSWORD_RESET_TOKEN, err);
                }

                return new Promise((resolve, reject) => {
                    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                        if (err) reject(new ApolloError("Failed to generate salt", AuthorizationErrorsCodes.BCRYPT_ERROR, {}));
                        bcrypt.hash(password, salt, null, (err, hash) => {
                            if (err) {
                                reject(new ApolloError("Failed to hash password", AuthorizationErrorsCodes.BCRYPT_ERROR, {}));
                            }
                            foundUser.password = hash;
                            foundUser.save().then(result => {
                                foundToken.remove().then(res => {
                                    resolve({ ...result._doc, password: null, _id: result.id })
                                });
                            });

                        })
                    })
                });
            })

        }
    }
};


const isEmail = function (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    return (false)
}


module.exports = {
    AuthResolvers: resolvers
};
const { Controls } = require("../../models/controls");
const { User } = require("../../models/user");

const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
    Query: {
        getControls: (parent, { }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return Controls.findOne({ user: context._id }).then(res => {
                if (!res) {
                    let newControls = new Controls(Object.assign({ user: context }));
                    return newControls.save().then(newControlsRes => {
                        return User.findById(context._id).then(user => {
                            user.controls = newControlsRes._id;
                            return user.save().then(u => {
                                return newControls._doc;
                            })
                        })
                    })
                }
                return res._doc; // do additional transformations here if needed
            });
        }
    },
    Mutation: {
        saveControls: (parent, { controls }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return User.findById(context._id).exec().then(async user => {
                if (!user.controls) {
                    let existingControlsForUser = await Controls.findOne({ user: context._id });
                    let controls_ = existingControlsForUser || new Controls({ user: user }, controls);
                    user.controls = controls_._id;
                    return controls_.save().then(controlRes => {
                        return user.save().then(res => {
                            return controls_._doc;
                        })
                    })
                }
                else {
                    return Controls.findOne({ user: context._id }).then(controlRes => {
                        controlRes = Object.assign(controlRes, controls);
                        return controlRes.save().then(r => {
                            return controlRes._doc;
                        })
                    })
                }


            })
        },
    }
}
module.exports = {
    ControlsResolvers: resolvers
}
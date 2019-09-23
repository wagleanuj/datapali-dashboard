const { FilledForm } = require("../../models/filledForm");
const { FormFile } = require("../../models/form");
const {User} = require("../../models/user")
const { AuthenticationError, ApolloError } = require("apollo-server-express");

const resolvers = {
    Query: {
        getFilledForms: async (parent, { bySurveyor }, context, info) => {
            if (!context._id) throw new AuthenticationError();
            if (context.accountType === "admin") {
                let found = [];
                if (bySurveyor) {
                    found = await FilledForm.find({ filledBy: bySurveyor }).exec();
                } else {
                    found = await FilledForm.find().exec();
                }
                return found;

            } else {
                let found = await FilledForm.find({ filledBy: context._id }).exec();
                return found;
            }
        }

    },
    Mutation: {
        saveFilledForm: async (parent, { filledForm }, context, info) => {
            if (!context._id) throw new AuthenticationError();
            let foundForm = await FilledForm.findOne({ id: filledForm.id }).exec();
            let result = null;
            if (foundForm) {
                foundForm.answerStore = (filledForm.answerStore);
                foundForm.filledBy = context._id;
                if (filledForm.completedDate) foundForm.completedDate = filledForm.completedDate;
                result = await foundForm.save();
            } else {
                let referredForm = await FormFile.findOne({ id: filledForm.formId }).exec();
                if (!referredForm) throw new ApolloError("Form does not exist");
                let ff = new FilledForm({
                    ...filledForm,
                    filledBy: context._id,
                    formId: referredForm._id,
                    answerStore: (filledForm.answerStore)
                });

                result = await ff.save();
                context.filledForms.push(result._id);
                await context.save();
            }
            return ({
                ...result._doc,
                id: filledForm.id
            })

        },
        deleteFilledForms: async (parent, { id }, context, info) => {
            if (!context._id) throw new AuthenticationError();
            id.forEach(async item => {
                let filledform = await FilledForm.findById(item);
                if (context.accountType === "admin" || filledform.filledBy.toString() === context._id.toString()) {
                    if (filledform) await filledform.remove();
                } else{
                    throw new ApolloError("Forbidden");
                }
            });
            return { message: "Successfully deleted filled forms" }
        },
        deleteAllFilledForms: async (parent, args, context, info) => {
            if(!context._id || context.accountType!=="admin") throw new AuthenticationError();
            let users = await User.find({}).exec();
            users.forEach(async item=>{
                item.filledForms = [];
                await item.save()
            });
            let filledForms = await FilledForm.find({}).exec();
            filledForms.forEach(async item=>{
                await item.remove()
            });
            return {message: " Sucessfully deleted all filled forms"};
        }

    }

}

module.exports = {
    FilledFormResolvers: resolvers
};
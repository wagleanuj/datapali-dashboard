const { FormFile } = require("../../models/form");
const { User } = require("../../models/user");

const { AuthenticationError, ApolloError } = require("apollo-server-express");

const resolvers = {
    Query: {
        forms: async (parent, { id }, context, info) => {
            if (!context._id || (context.accountType !== "admin" && !id)) throw new AuthenticationError();
            return FormFile.find({}).then(formFiles => {
                if (!formFiles) return [];
                if (id) {
                    let found = [];
                    if (context.accountType === "surveyor") {
                        found = formFiles.filter(item => id.includes(item.id) && context.availableForms.includes(item._id));
                    } else {
                        found = formFiles.filter(item => id.includes(item.id));
                    }
                    return found.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            content: item.content
                        }
                    })
                }
                return formFiles.map(item => ({ id: item.id, name: item.id, content: item.content }))
            })
        }

    },
    Mutation: {
        makeFormAvailableFor: async (parent, { formId, surveyorEmail }, context, info) => {
            if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
            let surveyor = await User.findOne({ email: surveyorEmail }).exec();
            if (!surveyor) throw new ApolloError("Surveyor not found");
            let form = await FormFile.findOne({ id: formId }).exec();
            if (!form) throw new ApolloError("Form not found");
            if (!surveyor.availableForms) surveyor.availableForms = [];
            if (!surveyor.availableForms.includes(form._id)) {
                surveyor.availableForms.push(form);
                await surveyor.save();
            }
            return { message: `Sucessfully made the form available for ${surveyorEmail}` };
        },
        makeFormUnavailableFor: async (parent, { formId, surveyorEmail }, context, info) => {
            if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
            let surveyor = await User.findOne({ email: surveyorEmail }).exec();
            if (!surveyor) throw new ApolloError("Surveyor not found");
            let form = await FormFile.findOne({ id: formId }).exec();
            if (!form) throw new ApolloError("Form not found");
            if (!surveyor.availableForms) surveyor.availableForms = [];
            let surveyFormIndex = surveyor.availableForms.findIndex(item=>item && item.toString()===form._id.toString());
            if (surveyFormIndex>-1) {
               surveyor.availableForms.splice(surveyFormIndex,1);
               console.log('removed');
               await surveyor.save();
            }
            return { message: `Sucessfully made the form unavailable for ${surveyorEmail}` };
        },


        saveForm: async (parent, { form }, context, info) => {
            if (!context._id || context.accountType === "surveyor") throw new AuthenticationError();
            if (form.id) {
                return FormFile.findOne({ id: form.id }).then(async formfile => {
                    if (!formfile) {
                        //create the new formfile
                        let rootFile = new FormFile({
                            createdBy: context._id,
                            content: form.content,
                            name: form.name,
                            id: form.id
                        })
                        let result = await rootFile.save();
                        return { ...result._doc, content: JSON.stringify(JSON.parse(formfile.content)) }
                    }
                    else {
                        //save the existing form 
                        formfile.content = form.content;
                        formfile.name = form.name;
                        let result = await formfile.save();
                        return { ...result._doc, content: JSON.stringify(JSON.parse(formfile.content)) };
                    }
                })
            }
        },
        deleteForm: async (parent, { id }, context, info) => {
            if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
            let deletion = id.map(item => {
                return FormFile.findOne({ id: item }).exec().then(f => {
                    if (!f) throw new ApolloError("File could not be found");
                    return f.remove();
                });
            });
            return Promise.all(deletion).then(r => {
                return { message: "Deleted successfully" };

            })
        }

    }
}


module.exports = {
    FormFileResolvers: resolvers
};
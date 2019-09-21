const { FormFile } = require("../../models/form");
const { AuthenticationError, ApolloError } = require("apollo-server-express");

const resolvers = {
    Query: {
        forms: async (parent, { id }, context, info) => {
            if (!context._id) throw new AuthenticationError();
            return FormFile.find({ createdBy: context._id }).then(formFiles => {
                if (!formFiles) return [];
                if (id) {
                    let returnval = {};
                    let found = formFiles.find(item => item.id === id);
                    if (found) {
                        returnval.id = found.id;
                        returnval.name = found.name;
                        returnval.content = JSON.stringify(found.content)
                    }
                    return [returnval];
                }
                return formFiles.map(item => ({ id: item.id, name: item.id, content: JSON.stringify(item.content) }))
            })
        }

    },
    Mutation: {
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
                        return { ...result._doc }
                    }
                    else {
                        //save the existing form 
                        formfile.content = JSON.parse(form.content);
                        formfile.name = form.name;
                        let result = await formfile.save();
                        return { ...result._doc };
                    }
                })
            }
        }
    },

}

module.exports = {
    FormFileResolvers: resolvers
};
const { FormFile } = require("../../models/form");

const resolvers = {
    Query: {
        forms: async (parent, { id }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return FormFile.find({ user: context._id }).then(formFiles => {
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
            if (!context.username) throw new AuthenticationError();
            if (form.id) {
                FormFile.findOne({ id: form.id }).then(async formfile => {
                    if (!formfile) {
                        //create the new formfile
                        console.log("form does not exist, creating");
                        let rootFile = new FormFile({
                            user: context._id,
                            content: form.content,
                            name: form.name,
                            id: form.id
                        })
                        await rootFile.save();
                        console.log("Saved");
                    }
                    else {
                        //save the existing form 
                        formfile.content = JSON.parse(form.content);
                        formfile.name = form.name;
                        await formfile.save();
                        console.log("form exists , overwriting");
                    }
                })
            }
        }
    }

}

module.exports = {
    FormFileResolvers: resolvers
};
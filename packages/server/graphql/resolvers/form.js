const { FormFile } = require("../../models/form");
const { User } = require("../../models/user");

const { AuthenticationError, ApolloError } = require("apollo-server-express");

const resolvers = {
    Query: {
        forms: async (parent, { id }, context, info) => {
            if (!context._id) throw new AuthenticationError();
            const dateTransformer = (item) => {
                item.createdAt = item.createdAt.getTime().toString();
                item.updatedAt = item.updatedAt.getTime().toString();
                return item;
            }
            
            return FormFile.find({}).populate("assignedTo").then(formFiles => {
                if (!formFiles) return [];
                if (id ) {
                    let found = [];
                    if (context.accountType === "surveyor") {
                        found = formFiles.filter(item => id.includes(item.id) && context.availableForms.includes(item._id)).map(dateTransformer);
                    } else {
                        found = formFiles.filter(item => id.includes(item.id)).map(dateTransformer);
                    }
                    return found;
                }
                if (context.accountType === "surveyor") {
                    return formFiles.filter(item => context.availableForms.includes(item._id)).map(dateTransformer);
                }
                const ret = formFiles.map(dateTransformer);
                return ret;
            })
        }
    },
    Mutation: {
        makeFormsAvailableFor: async (parent, { formIds, surveyorEmails }, context, info) => {
            if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
            const surveyors = await User.find({
                "email":{
                    $in:surveyorEmails
                }
            }).exec();
            const specifiedForms = await FormFile.find({
                id: {
                    $in: formIds
                }
            }).exec();
            surveyors.forEach(surv=>{
                if(!surv) throw new ApolloError("Surveyor not found");
                specifiedForms.forEach(form=>{
                    if(!form) throw new ApolloError("Form not found ");
                    if(!form.assignedTo.includes(surv._id)){
                        form.assignedTo.push(surv);
                        
                    }
                    if(!surv.availableForms.includes(form._id)){
                        surv.availableForms.push(form);
                    }
                })
            });
            await Promise.all( surveyors.map(item=>item.save()))
            await Promise.all(specifiedForms.map(item=>item.save()))
            return { message: `Sucessfully made the form available for ${surveyorEmails}` };
        },
        makeFormsUnavailableFor: async (parent, { formIds, surveyorEmails }, context, info) => {
            if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
            if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
            const surveyors = await User.find({
                "email":{
                    $in:surveyorEmails
                }
            }).exec();
            const specifiedForms = await FormFile.find({
                id: {
                    $in: formIds
                }
            }).exec();
            surveyors.forEach(surv=>{
                if(!surv) throw new ApolloError("Surveyor not found");
                specifiedForms.forEach(form=>{
                    if(!form) throw new ApolloError("Form not found ");
                    const surveyFormIndex = surv.availableForms.findIndex(item => item && item.toString() === form._id.toString());
                    if(surveyFormIndex>-1){
                        surv.availableForms.splice(surveyFormIndex,1);
                    }
                    const userIndex = form.assignedTo.findIndex(item=>item && item.toString()===surv._id.toString());
                    if(userIndex>-1){
                        form.assignedTo.splice(userIndex, 1);
                    }
                })
            });
            await Promise.all( surveyors.map(item=>item.save()))
            await Promise.all(specifiedForms.map(item=>item.save()))

           
            return { message: `Sucessfully made the form unavailable for ${surveyorEmails}` };
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
                        context.createdForms.push(rootFile);
                        await context.save();
                        let result = await rootFile.save();
                        return { ...result._doc, content: JSON.stringify(JSON.parse(rootFile.content)) }
                    }
                    else {
                        //save the existing form 
                        formfile.content = form.content;
                        formfile.name = form.name;
                        let result = await formfile.save();
                        if (!context.createdForms.includes(formfile._id)) {
                            context.createdForms.push(formfile);
                            await context.save()
                        }
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
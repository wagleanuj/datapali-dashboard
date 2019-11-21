const { FormFile } = require("../../models/form");
const { FilledForm } = require("../../models/filledForm");

const { User } = require("../../models/user");
const { makeTree, makeSchema } = require("../../utils/formdbHelper");
const { AuthenticationError, ApolloError } = require("apollo-server-express");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { MongooseQueryParser } = require('mongoose-query-parser');
const parser = new MongooseQueryParser();

const resolvers = {
  Query: {
    forms: async (parent, { id }, context, info) => {
      if (!context._id) throw new AuthenticationError();
      const dateTransformer = item => {
        item.createdAt = item.createdAt.getTime().toString();
        item.updatedAt = item.updatedAt.getTime().toString();
        return item;
      };

      return FormFile.find({})
        .populate("assignedTo")
        .then(formFiles => {
          if (!formFiles) return [];
          if (id) {
            let found = [];
            if (context.accountType === "surveyor") {
              found = formFiles
                .filter(
                  item =>
                    id.includes(item.id) &&
                    context.availableForms.includes(item._id)
                )
                .map(dateTransformer);
            } else {
              found = formFiles
                .filter(item => id.includes(item.id))
                .map(dateTransformer);
            }
            return found;
          }
          if (context.accountType === "surveyor") {
            return formFiles
              .filter(item => context.availableForms.includes(item._id))
              .map(dateTransformer);
          }
          const ret = formFiles.map(dateTransformer);
          return ret;
        });
    },
    runQueryOn: async (parent, { formId, query }, context, info) => {
      if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
      if (!mongoose.models[formId]) throw new ApolloError("Database has not been initialized");
      const formModel = mongoose.models[formId];
      const qq = parser.parse(query);
      const { filter, skip, limit, sort, projection, population } = qq;
      const results = await formModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select(projection)
        .populate(population);
      return JSON.stringify(results);
    },
    runAggregationOn: async (parent, { formId, query }, context, info) => {
      if (!context._id || context.accountType !== "admin") throw new AuthenticationError();
      if(!mongoose.models[formId]) throw new ApolloError("Database has not been initialized");
      const formModel = mongoose.models[formId];
      const q = JSON.parse(query);
      console.log(q);
      const results = await formModel.aggregate(q).exec();
      return JSON.stringify(results);
    }
  },
  Mutation: {
    makeFormsAvailableFor: async (
      parent,
      { formIds, surveyorEmails },
      context,
      info
    ) => {
      if (!context._id || context.accountType !== "admin")
        throw new AuthenticationError();
      const surveyors = await User.find({
        email: {
          $in: surveyorEmails
        }
      }).exec();
      const specifiedForms = await FormFile.find({
        id: {
          $in: formIds
        }
      }).exec();
      surveyors.forEach(surv => {
        if (!surv) throw new ApolloError("Surveyor not found");
        specifiedForms.forEach(form => {
          if (!form) throw new ApolloError("Form not found ");
          if (!form.assignedTo.includes(surv._id)) {
            form.assignedTo.push(surv);
          }
          if (!surv.availableForms.includes(form._id)) {
            surv.availableForms.push(form);
          }
        });
      });
      await Promise.all(surveyors.map(item => item.save()));
      await Promise.all(specifiedForms.map(item => item.save()));
      return {
        message: `Sucessfully made the form available for ${surveyorEmails}`
      };
    },
    makeFormsUnavailableFor: async (
      parent,
      { formIds, surveyorEmails },
      context,
      info
    ) => {
      if (!context._id || context.accountType !== "admin")
        throw new AuthenticationError();
      if (!context._id || context.accountType !== "admin")
        throw new AuthenticationError();
      const surveyors = await User.find({
        email: {
          $in: surveyorEmails
        }
      }).exec();
      const specifiedForms = await FormFile.find({
        id: {
          $in: formIds
        }
      }).exec();
      surveyors.forEach(surv => {
        if (!surv) throw new ApolloError("Surveyor not found");
        specifiedForms.forEach(form => {
          if (!form) throw new ApolloError("Form not found ");
          const surveyFormIndex = surv.availableForms.findIndex(
            item => item && item.toString() === form._id.toString()
          );
          if (surveyFormIndex > -1) {
            surv.availableForms.splice(surveyFormIndex, 1);
          }
          const userIndex = form.assignedTo.findIndex(
            item => item && item.toString() === surv._id.toString()
          );
          if (userIndex > -1) {
            form.assignedTo.splice(userIndex, 1);
          }
        });
      });
      await Promise.all(surveyors.map(item => item.save()));
      await Promise.all(specifiedForms.map(item => item.save()));

      return {
        message: `Sucessfully made the form unavailable for ${surveyorEmails}`
      };
    },

    saveForm: async (parent, { form }, context, info) => {
      if (!context._id || context.accountType === "surveyor")
        throw new AuthenticationError();
      if (form.id) {
        return FormFile.findOne({ id: form.id }).then(async formfile => {
          if (!formfile) {
            //create the new formfile
            let rootFile = new FormFile({
              createdBy: context._id,
              content: form.content,
              name: form.name,
              id: form.id
            });
            context.createdForms.push(rootFile);
            await context.save();
            let result = await rootFile.save();
            return {
              ...result._doc,
              content: JSON.stringify(JSON.parse(rootFile.content))
            };
          } else {
            //save the existing form
            formfile.content = form.content;
            formfile.name = form.name;
            let result = await formfile.save();
            if (!context.createdForms.includes(formfile._id)) {
              context.createdForms.push(formfile);
              await context.save();
            }
            return {
              ...result._doc,
              content: JSON.stringify(JSON.parse(formfile.content))
            };
          }
        });
      }
    },
    deleteForm: async (parent, { id }, context, info) => {
      if (!context._id || context.accountType !== "admin")
        throw new AuthenticationError();
      let deletion = id.map(item => {
        return FormFile.findOne({ id: item })
          .exec()
          .then(f => {
            if (!f) throw new ApolloError("File could not be found");
            return f.remove();
          });
      });
      return Promise.all(deletion).then(r => {
        return { message: "Deleted successfully" };
      });
    },

    initDbFor: async (parent, { formId, }, context, info) => {
      // if (!context._id || context.accountType !== "admin")
      //   throw new AuthenticationError();
      const formFile = await FormFile.findOne({ id: formId }).exec();
      // const filledForm = await FilledForm.findOne({formid: formId});
      // if(!filledForm) throw new ApolloError("No filled forms found to create the db. You need to have at least one filled form submitted in order to initialize");
      const hasDB = !!formFile.dbId;
      const isDBinitialized = !!mongoose.models[formFile.id];
      if (isDBinitialized) {
        //reinit
        delete mongoose.models[formFile.id];
        await mongoose.connection.dropCollection(formFile.id);

      }
      if (hasDB) {
        //make update to the schema
      } else {
        const fileObj = formFile.toObject();
        fileObj.content = JSON.parse(fileObj.content);
        const normalized = makeTree(fileObj);

        const formSchema = makeSchema(normalized, formFile.id);
        formSchema.add({
          id: { type: Schema.Types.String, required: true },
          formId: { type: Schema.Types.String },
          revision: { type: Schema.Types.String }
        })
        const FORM_MODEL = mongoose.model(fileObj.id, formSchema);

        const allFilledForms = await FilledForm.find({ formId: formId }).exec();
        const formDocuments = allFilledForms.map(ff => {
          const ffObj = ff.toObject();
          const newObj = Object.assign({}, {
            id: ff.id,
            formId: ff.formId,

          }, JSON.parse(ffObj.answerStore));
          const formObj = new FORM_MODEL(newObj);
          return formObj.save();
        });
        await Promise.all(formDocuments);
        const all = await FORM_MODEL.findOne({}).exec();
        return {
          message: "initialized db!" + all.toString()
        }
      }
      return {
        message: "success"
      }
    },
    // disposeDbFor: async (parent, { formId }, context, info) => {
    //   if (!context._id || context.accountType !== "admin")
    //     throw new AuthenticationError();
    //   const formFile = await FormFile.findOne({ id: formId }).exec();
    //   const hasDB = !!formFile.dbId;
    //   if (hasDB) {
    //       //dispose it 
    //   }
    // }

  }

};

module.exports = {
  FormFileResolvers: resolvers
};


function initDB(formId, ) {

}
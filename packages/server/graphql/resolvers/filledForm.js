const { FilledForm } = require("../../models/filledForm");
const { FormFile } = require("../../models/form");
const { User } = require("../../models/user");
const { AuthenticationError, ApolloError } = require("apollo-server-express");

const resolvers = {
  Query: {
    getFilledForms: async (
      parent,
      { bySurveyorEmail, pagination },
      context,
      info
    ) => {
      if (!context._id) throw new AuthenticationError();
      const totalCount = await FilledForm.countDocuments({}).exec();
      if (context.accountType === "admin") {
        let found = [];
        if (bySurveyorEmail) {
          let findPromise = null;
          const surveyor = await User.findOne({
            email: bySurveyorEmail
          }).exec();
          if (
            pagination &&
            Number.isInteger(pagination.offset) &&
            Number.isInteger(pagination.limit)
          ) {
            findPromise = FilledForm.find({
              filledBy: surveyor._id
            })
              .skip(pagination.offset)
              .limit(pagination.limit)
              .populate("filledBy");
          } else {
            findPromise = FilledForm.find({ filledBy: surveyor._id }).populate(
              "filledBy"
            );
          }
          found = await findPromise.exec();
        } else {
          let findPromise = null;
          if (
            pagination &&
            Number.isInteger(pagination.offset) &&
            Number.isInteger(pagination.limit)
          ) {
            findPromise = FilledForm.find({})
              .skip(pagination.offset)
              .limit(pagination.limit)
              .populate("filledBy");
          } else {
            findPromise = FilledForm.find({}).populate("filledBy");
          }
          found = await findPromise.exec();
        }
        return {forms:found, totalCount:totalCount};
      } else {
        let findPromise = null;
        if (
          pagination &&
          Number.isInteger(pagination.offset) &&
          Number.isInteger(pagination.limit)
        ) {
          findPromise = FilledForm.find({ filledBy: context._id })
            .skip(pagination.offset)
            .limit(pagination.limit)
            .populate("filledBy");
        } else {
          findPromise = FilledForm.find({ filledBy: context._id }).populate(
            "filledBy"
          );
        }
        found = await findPromise.exec();
        return {forms:found, totalCount:totalCount};
      }
    },
    getFilledFormById: async (parent, { ids }, context, info) => {
      if (!context._id) throw new AuthenticationError();
      const foundForms = await FilledForm.find({
        id: { $in: ids }
      })
        .populate("filledBy")
        .exec();

      if (context.accountType === "admin") {
        return foundForms;
      } else {
        //check permission for surveyor
        foundForms.forEach(ff => {
          if (ff.filledBy !== context._id.toString()) {
            throw new AuthenticationError();
          }
        });
        return foundForms;
      }
    }
  },
  Mutation: {
    saveFilledForm: async (parent, { filledForm }, context, info) => {
      if (!context._id) throw new AuthenticationError();
      let foundForm = await FilledForm.findOne({ id: filledForm.id }).exec();
      let result = null;
      if (foundForm) {
        foundForm.answerStore = filledForm.answerStore;
        if (filledForm.completedDate)
          foundForm.completedDate = parseInt(filledForm.completedDate);
        foundForm.lastModifyUser = context;
        result = await foundForm.save();
      } else {
        let referredForm = await FormFile.findOne({
          id: filledForm.formId
        }).exec();
        if (!referredForm) throw new ApolloError("Form does not exist");
        let ff = new FilledForm({
          ...filledForm,
          filledBy: context,
          answerStore: filledForm.answerStore,
          lastModifyUser: context
        });

        result = await ff.save();
        context.filledForms.push(result._id);
        await context.save();
      }
      return {
        ...result._doc,
        id: filledForm.id
      };
    },
    deleteFilledForms: async (parent, { id }, context, info) => {
      if (!context._id) throw new AuthenticationError();
      id.forEach(async item => {
        let filledform = await FilledForm.findById(item);
        if (
          context.accountType === "admin" ||
          filledform.filledBy.toString() === context._id.toString()
        ) {
          if (filledform) await filledform.remove();
        } else {
          throw new ApolloError("Forbidden");
        }
      });
      return { message: "Successfully deleted filled forms" };
    },
    deleteAllFilledForms: async (parent, args, context, info) => {
      if (!context._id || context.accountType !== "admin")
        throw new AuthenticationError();
      let users = await User.find({}).exec();
      users.forEach(async item => {
        item.filledForms = [];
        await item.save();
      });
      let filledForms = await FilledForm.find({}).exec();
      filledForms.forEach(async item => {
        await item.remove();
      });
      return { message: " Sucessfully deleted all filled forms" };
    }
  }
};

module.exports = {
  FilledFormResolvers: resolvers
};

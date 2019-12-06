const { AuthResolvers } = require('./auth');
const { FilledFormResolvers } = require("./filledForm");
const {UserResolvers} = require("./users");
const { FormFileResolvers } = require("./form");
const rootResolver = {
    Query: Object.assign({}, AuthResolvers.Query, FormFileResolvers.Query, FilledFormResolvers.Query, UserResolvers.Query),
    Mutation: Object.assign({}, AuthResolvers.Mutation, FormFileResolvers.Mutation, FilledFormResolvers.Mutation, UserResolvers.Mutation ),
};

module.exports = rootResolver;
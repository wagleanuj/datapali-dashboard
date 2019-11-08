const { AuthResolvers } = require('./auth');
const { FilledFormResolvers } = require("./filledForm");

const { FormFileResolvers } = require("./form");
const rootResolver = {
    Query: Object.assign({}, AuthResolvers.Query, FormFileResolvers.Query, FilledFormResolvers.Query),
    Mutation: Object.assign({}, AuthResolvers.Mutation, FormFileResolvers.Mutation, FilledFormResolvers.Mutation ),
};

module.exports = rootResolver;
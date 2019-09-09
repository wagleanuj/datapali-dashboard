const { AuthResolvers } = require('./auth');
const { LevelResolvers } = require('./level');
const { GameFileResolvers } = require('./gameFile');
const { ControlsResolvers } = require("./controls");

const { FormFileResolvers } = require("./form");
const rootResolver = {
    Query: Object.assign({}, AuthResolvers.Query, FormFileResolvers.Query),
    Mutation: Object.assign({}, AuthResolvers.Mutation, FormFileResolvers.Mutation ),
};

module.exports = rootResolver;
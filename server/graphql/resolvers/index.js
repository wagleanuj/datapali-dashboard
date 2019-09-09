const { AuthResolvers } = require('./auth');
const { LevelResolvers } = require('./level');
const { GameFileResolvers } = require('./gameFile');
const { ControlsResolvers } = require("./controls");
const rootResolver = {
    Query: Object.assign({}, AuthResolvers.Query, LevelResolvers.Query, GameFileResolvers.Query, ControlsResolvers.Query),
    Mutation: Object.assign({}, AuthResolvers.Mutation, LevelResolvers.Mutation, GameFileResolvers.Mutation, ControlsResolvers.Mutation),
};

module.exports = rootResolver;
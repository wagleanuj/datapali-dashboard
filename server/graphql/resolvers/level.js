const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { User } = require('../../models/user');
const { Level } = require('../../models/Level');
const { GameFile } = require('../../models/gameFile');

const CREATOR = process.env.STORY_LEVEL_CREATOR;
const resolvers = {
    Query: {
        //not providing levelId will return all the levels
        getLevel: (parent, { levelId }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return Level.find({ creator: context._id }).then(levels => {
                if (!levelId) return levels;
                return levels.find(l => l._id === levelId) || [];
            })
        },
        getStoryLevel: (parent, { levelIndex, gameFileId }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            //cannot request a story level if you donthave gameFile
            return User.findOne({ username: CREATOR }).exec().then(creator => {
                return Level.find({ creator: creator._id }).then(levels => {
                    if (!levelIndex) {
                        return User.findById(context._id).populate({ path: "gameFiles", populate: { path: "progress" } }).exec().then(async user => {
                            let gamefile = await GameFile.findById(gameFileId).populate("progress").exec();
                            if (!gamefile) throw new ApolloError("Game file could not be found");
                            let upto = 0;
                            levels.forEach((l, i) => {
                                let found = gamefile.progress.find(lp =>{
                                    return lp.levelId.toString() === l._id.toString();
                                }) 
                                if (found && found.success) {
                                    upto = i + 2;
                                }
                            });
                            return levels.slice(0, upto === 0 ? 1 : upto);
                        })

                    }

                    return levels.slice(levelIndex, 1);
                })
            })
        }
    },
    Mutation: {
        //if levelId is provided, it will save instead of creating a new entry
        saveLevel: (parent, { levelData, levelName, levelId }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            if (levelId) {
                return Level.findById(levelId).then(level => {
                    if (!level) throw new ApolloError("Level Could not be found");
                    if (level.creator.toString() != context._id.toString()) throw new AuthenticationError("You are not authorized to access this level");
                    level.data = levelData;
                    return level.save().then(saved => {
                        return level;
                    })
                })
            }
            else {
                let level = new Level({
                    name: levelName,
                    creator: context._id,
                    data: levelData
                });
                return level.save().then(saved => {
                    return User.findById(context._id).then(creator => {
                        if (!creator) throw new ApolloError("User not found");
                        creator.savedLevels.push(level);
                        return creator.save().then(res => {
                            return level;
                        })
                    })
                })
            }
        },

        deleteLevel: (parent, { levelId }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return Level.findOne({ _id: levelId }).then(level => {
                if (!level) throw new ApolloError("Level does not exist");
                return level.remove().then(r => {
                    return { message: "Successfully deleted" };
                })
            })
        },

        deleteAll: (parent, { }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return Level.find({ creator: context._id }).then(levels => {
                return Promise.all(levels.map(level => {
                    return level.remove();
                })).then(res => {
                    return { message: "Successfully deleted all levels" };
                });
            });
        },
    }
}

module.exports = {
    LevelResolvers: resolvers
};
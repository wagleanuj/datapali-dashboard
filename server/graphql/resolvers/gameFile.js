const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { LevelProgress, GameFile } = require("../../models/gameFile");
const { Level } = require('../../models/Level');
const { User } = require('../../models/user');
const USER_GAME_FILES_LIMIT = 3;
const CREATOR_USERNAME = process.env.STORY_LEVEL_CREATOR;

const resolvers = {
    Query: {
        getGameFile: (parent, { gameFileId }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return GameFile.find({ user: context._id }).populate("progress").exec().then(res => {
                if (!gameFileId) {
                    return res;
                }
                return res.find(r => r._id === gameFileId);
            })
        },
        leaderBoard: async (parent, { }, context, info) => {
            let creator = await User.findOne({ username: CREATOR_USERNAME }).exec();
            //summation of best times
            return GameFile.find({}).populate("user").populate("progress").exec().then(async gameFiles => {
                let leaderboard = [];
                gameFiles.forEach(gf => {
                    let hasCompletedGame = false;
                    let totalTime = 0;
                    let finalLevel = creator.savedLevels[creator.savedLevels.length - 1];
                    //check if player has completed final level
                    let progress = gf.progress.find((p, i) => { if (p.levelId.toString() === finalLevel.toString()) { return true; }; })
                    if (progress) {
                        hasCompletedGame = true;
                        completionDate = progress.completionDate;
                        creator.savedLevels.forEach(storylevel => {
                            let pr = gf.progress.find((p, i) => { if (p.levelId.toString() === storylevel.toString()) { return true; }; });
                            if (pr) {
                                totalTime += pr.bestTime;
                            }
                        });
                    }
                    if (hasCompletedGame) {
                        leaderboard.push({
                            user: gf.user.username,
                            completionTime: totalTime,
                            completionDate: completionDate,
                            difficulty: gf.difficulty
                        })
                    }
                })
                return leaderboard;
            })
        }
    },
    Mutation: {
        saveGameFile: async (parent, { gameFile }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            if (gameFile._id) {
                return GameFile.findById(gameFile._id).then(async gamefile => {
                    if (!gamefile) throw new ApolloError("Game file could not be found");
                    let storylevels = await User.findOne({ username: CREATOR_USERNAME }).exec().then(res => res ? res.savedLevels : []);
                    for (let i = 0; i < gameFile.progress.length; i++) {
                        let progress = gameFile.progress[i];
                        let levelProgress;
                        if (progress._id) {
                            levelProgress = await LevelProgress.findById(progress._id);
                        }
                        if (!levelProgress) {
                            levelProgress = new LevelProgress(Object.assign({ user: context._id, gameFile: gamefile._id }, progress));
                            await levelProgress.save();
                            gamefile.progress.push(levelProgress);
                        }
                        else {
                            levelProgress = Object.assign(levelProgress, progress);
                            levelProgress = await levelProgress.save();
                        }
                        if (levelProgress.levelId.toString() === storylevels[storylevels.length - 1].toString() && levelProgress.success) {
                            gamefile.hasCompleted = true;
                        }
                    }
                    await gamefile.save();
                    return GameFile.findById(gameFile._id).populate("progress").exec().then(res => {
                        return res._doc; //might need to transform so that graphql can understand
                    });
                })
            }
            else {
                let user = await User.findById(context._id).populate("gameFiles").exec();
                if (user.gameFiles.length >= USER_GAME_FILES_LIMIT) {
                    throw new ApolloError(`Cannot save more than ${USER_GAME_FILES_LIMIT} game files`);
                }
                let newGameFile = new GameFile({
                    user: context._id,
                    difficulty: gameFile.difficulty,
                    progress: []
                });

                let gf = await newGameFile.save();
                for (let i = 0; i < gameFile.progress.length; i++) {
                    let progress = gameFile.progress[i];
                    let newprogress = new LevelProgress(Object.assign({ user: context._id, gameFile: gf._id }, progress));
                    await newprogress.save();
                    await newGameFile.progress.push(newprogress);
                }
                await newGameFile.save();
                user.gameFiles.push(newGameFile);
                await user.save();
                return GameFile.findById(gf._id).populate("progress").exec().then(res => {
                    return res; //might need to transform so that graphql can understand
                });
            }
        },

        deleteGameFile: (parent, { gameFileId }, context, info) => {
            if (!context.username) throw new AuthenticationError();
            return GameFile.findById(gameFileId).then(async gf => {
                if (!gf) throw new ApolloError("Game file could not be found");
                let progressDeletion = []
                for (let i = 0; i < gf.progress.length; i++) {
                    progressDeletion.push(LevelProgress.findById(gf.progress[i]._id).then(progress => {
                        if (progress) {
                            return progress.remove().then(res => true);
                        }
                        else return Promise.resolve(true);
                    }))

                }
                return Promise.all(progressDeletion).then(done => {
                    return gf.remove().then(removed => {
                        return User.findById(context._id).populate("gameFiles").exec().then(async user => {
                            let ind = 0;
                            for (let i = 0; i < user.gameFiles.length; i++) {
                                if (user.gameFiles[i]._id.toString() === gameFileId) {
                                    ind = i;
                                    break;
                                }
                            }
                            user.gameFiles.splice(ind, 1);
                            await gf.save();
                            await user.save();
                            return {
                                success: true,
                                gameFiles: user._doc.gameFiles
                            }

                        })
                    })
                })

            })
        }
    }
}

module.exports = {
    GameFileResolvers: resolvers
};
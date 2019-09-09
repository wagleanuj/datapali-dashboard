const { Schema, model } = require("mongoose");

const GameFile = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    progress: [{ type: Schema.Types.ObjectId, required: true, ref: "LevelProgress" }],
    hasCompleted: {type: Boolean, required: true, default: false}
})

const LevelProgress = new Schema({
    gameFile: { type: Schema.Types.ObjectId, required: true, ref: "GameFile" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    levelId: { type: Schema.Types.ObjectId, required: true, ref: "Level" },
    timeSpent: { type: Number, required: true },
    bestTime: { type: Number, required: false },
    coinsCollected: { type: Number, required: false },
    success: {type: Boolean, required: false},
    completionDate: {type: Number, required:false}//best time date
})

module.exports = {
    GameFile: model("GameFile", GameFile),
    LevelProgress: model("LevelProgress", LevelProgress)
} 
const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    savedLevels: [
        {
            type: Schema.Types.ObjectId,
            ref: "Level"
        }
    ],
    gameFiles: [{ type: Schema.Types.ObjectId, ref: "GameFile" }],
    controls:{type: Schema.Types.ObjectId, required: false, ref:"Controls"}    
}, { timestamps: true })
module.exports = {
    User: model("User", userSchema)
}
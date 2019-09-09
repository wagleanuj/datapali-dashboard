const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    creationDate: { type: Date, default: Date.now },
    data: { type: Object }
})

module.exports = {
    Level: model("Level", levelSchema)
}
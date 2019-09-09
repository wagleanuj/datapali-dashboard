const { Schema, model } = require('mongoose');

const controlSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    UP: { type: String, required: true, default: "ArrowUp" },
    DOWN: { type: String, required: true, default: "ArrowDown" },
    LEFT: { type: String, required: true, default: "ArrowLeft" },
    RIGHT: { type: String, required: true, default: "ArrowRight" },
    JUMP: { type: String, required: true, default: "KeyX" },
    SLIDE: { type: String, required: true, default: "KeyC" },
    ACTION: { type: String, required: true, default: "KeyZ" },
    LEFT_SWAP: { type: String, required: true, default: "KeyA" },
    RIGHT_SWAP: { type: String, required: true, default: "KeyD" },
});

module.exports = {
    Controls: model("Controls", controlSchema)
}



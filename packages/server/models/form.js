const { Schema, model } = require("mongoose");

const FormFile = new Schema({
    id: { type: Schema.Types.String, required: true },
    name: { type: Schema.Types.String, required: false },
    content: { type: Schema.Types.String },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    assignedTo: [{type: Schema.Types.ObjectId, required: true, ref: "User"}]
}, { timestamps: true });


module.exports = {
    FormFile: model("FormFile", FormFile),
} 
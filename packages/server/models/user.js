const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        required: true,
        enum: ["admin","surveyor"]
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    surveyorCode: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdForms: [{type: Schema.Types.ObjectId, ref: "FormFile"}],
    availableForms: [{type: Schema.Types.ObjectId, ref : "FormFile"}],
    filledForms: [{ type: Schema.Types.ObjectId, ref: "FilledForm" }],
}, { timestamps: true })
module.exports = {
    User: model("User", userSchema)
}
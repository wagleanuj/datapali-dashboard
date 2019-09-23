const { Schema, model } = require('mongoose');
const filledForm = new Schema({
    id: { type: String, required: true },
    startedDate: { type: Number, required: true, default: -1 },
    completedDate: { type: Number, required: false, default: -1 },
    formId: { type: Schema.Types.ObjectId, required: true, ref: "FormFile" },
    filledBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    answerStore: { type: Object, required: true }
}, { timestamps: true })

module.exports = {
    FilledForm: model("FilledForm", filledForm)
}
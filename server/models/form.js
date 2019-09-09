const { Schema, model } = require("mongoose");

const FormFile = new Schema({
    id: {type: Schema.Types.String, required: true},
    name : {type: Schema.Types.String, required: false},
    content : [{type: Object}],
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
})

const QuestionSection = new Schema({
    id: {type: Schema.Types.String, required: true},
    name: {type: Schema.Types.String},
    content : [{type: Schema.Types.ObjectId, refPath: "onModel"}],
    onModel: {type: Schema.Types.String, required: true, enum :['QuestionSection', 'QAQuestion']},
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    duplicatingSettings: {type: Object, required: true}
});

const QAQuestion = new Schema ({
    id: {type: Schema.Types.String, required: true},
    name : {type: String},
    questionContent: {type: Object, required: true},
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    appearingCondition: {type: Object, required: false},
    autoAnswer: {type: Object, required: false},
    options: {type: Object, required: false},
    answerType: {type: Object, required: false}
})




module.exports = {
    FormFile: model("FormFile", FormFile),
    QuestionSection: model("QuestionSection", QuestionSection),
    QAQuestion: model("QAQuestion", QAQuestion)

} 
const { Schema, model } = require("mongoose");

const FormFile = new Schema({
    id: {type: Schema.Types.String, required: true},
    name : {type: Schema.Types.String, required: false},
    content : [{type: Object}],
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});


module.exports = {
    FormFile: model("FormFile", FormFile),
} 
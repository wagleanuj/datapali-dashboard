const {Schema,model} = require("mongoose");

const resetTokenSchema = new Schema({
    token: {
        type:String,
        required:true,
    }
})
module.exports = {
    ResetToken: model("ResetToken",resetTokenSchema)
}
const mongoose = require('mongoose');
const {Schema} = mongoose;

const MessageSchema = new Schema({
    chatId:{
        type:mongoose.ObjectId,
    },
    senderId:{
        type:mongoose.ObjectId,
        ref: "users",
    },
    recevierId:{
        type:mongoose.ObjectId,
        ref: "users",
    },
    message:{
        type:String
    }
})

module.exports = mongoose.model('messages',MessageSchema)
const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChatSchema = new Schema({
    members:[
        {
            type: mongoose.ObjectId,
            ref: "users"
          }
    ],
    lastMessage:{
        type:String,
        default:''
    }
},{timestamps:true})

module.exports = mongoose.model('chats', ChatSchema)
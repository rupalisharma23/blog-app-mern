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
    },
    unreadCount:{
        type:String,
        default:0
    }
},{timestamps:true})

module.exports = mongoose.model('chats', ChatSchema)
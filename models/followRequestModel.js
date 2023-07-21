const mongoose = require('mongoose');
const {Schema} = mongoose;

const FollowRequestSchema = new Schema({
    sendersId:{
        type:mongoose.ObjectId,
        ref:'users',
        require:true
    },
    recieversId:{
        type:mongoose.ObjectId,
        ref:'users',
        require:true
    }
},{timestamps:true})

module.exports = mongoose.model("followRequest", FollowRequestSchema);
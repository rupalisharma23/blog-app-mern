const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    // require:true
  },
  frineds: [
    {
      type: mongoose.ObjectId,
      ref: "users"
    },
  ],
  profile:{
    type:String,
    default:''
  },
  cover:{
    type:String,
    default:''
  }
});

module.exports = mongoose.model("users", UserSchema);
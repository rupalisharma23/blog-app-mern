const User = require("../models/user");

const getAllUsers = async(req,res) =>{
    try{
        const friendsOfUser = await User.findOne({_id:req.params._id})
        const friendsList = friendsOfUser.frineds.map((friend)=>{return friend._id});
        let newArray = [req.params._id,...friendsList];
        const allUsers = await User.find({_id: { $nin: newArray }}).select('-password');
        res.status(200).send({ allUsers });

    }
    catch(error){
        console.log('error in getAllUsers', error);
        res.status(400).send({error:error})
    }
}

const sendFollowRequest = async(req,res) =>{
    try {
        const {sendersId,recieversId} = req.body
        const sender = await User.findOneAndUpdate(
          { _id: sendersId },
          { $push: { frineds: recieversId } },
          { new: true }
        );
        res.status(200).send({message:'request sent'})
    } catch (error) {
      console.log("error in sendFollowRequest", error);
      res.status(400).send({ error: error });
    }
}



module.exports = { getAllUsers, sendFollowRequest };

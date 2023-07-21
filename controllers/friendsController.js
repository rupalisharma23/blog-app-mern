const User = require("../models/user");
const followRequest = require('../models/followRequestModel')

const getAllUsers = async(req,res) =>{
    try{
        let arrayOfIds = [req.params._id];
        const friendRequestAlreadySendt = await followRequest.find({sendersId:req.params._id}).select('recieversId')
        const recieversIdsToExclude = friendRequestAlreadySendt.map((data) => data.recieversId);
        arrayOfIds.push(...recieversIdsToExclude);
        const allUsers = await User.find({_id: { $nin: arrayOfIds }}).select('-password');
        res.status(200).send({ allUsers, friendRequestAlreadySendt });

    }
    catch(error){
        console.log('error in getAllUsers', error);
        res.status(400).send({error:error})
    }
}

const sendFollowRequest = async(req,res) =>{
    try {
        const {sendersId,recieversId} = req.body
        const followRequestSent = await followRequest.create({
          sendersId,
          recieversId,
        });
        res.status(200).send({message:'request sent', followRequestSent})
    } catch (error) {
      console.log("error in sendFollowRequest", error);
      res.status(400).send({ error: error });
    }
}

const getFollowRequest = async(req,res) =>{
    try {

        const getFollowRequestsList = await followRequest.find({recieversId:req.params._id}).populate({path:'sendersId', select:{password:0}})
        res.status(200).send({ getFollowRequestsList });

    } catch (error) {
      console.log("error in getFollowRequest", error);
      res.status(400).send({ error: error });
    }
}

const deleteFollowRequest = async(req,res) =>{
    try 
    {
        const { sendersId, recieversId } = req.body;
        const followRequestDeleted = await followRequest.findOneAndDelete({sendersId, recieversId},{new:true})
        res.status(200).send({message:'request deleted',followRequestDeleted})

    } catch (error) {
      console.log("error in deleteFollowRequest", error);
      res.status(400).send({ error: error });
    }
}

const acceptFollowRequest = async(req,res) =>{
    try{

        const { sendersId, recieversId } = req.body;
        const sender = await User.findOneAndUpdate(
          { _id: sendersId },
          { $push: { frineds: recieversId } },
          { new: true }
        );
        console.log(sender)

        const followRequestDeleted = await followRequest.findOneAndDelete(
          { sendersId, recieversId },
          { new: true }
        );

        res.status(200).send({message:'friends added'})

    }
    catch(error){
        console.log("error in acceptFollowRequest", error);
    }
}

module.exports = { getAllUsers, sendFollowRequest, getFollowRequest,deleteFollowRequest,acceptFollowRequest };

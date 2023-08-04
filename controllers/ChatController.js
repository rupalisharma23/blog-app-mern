const chats = require('../models/ChatModel');
const messages = require('../models/MessageModel');
const User = require("../models/user");

const createChat = async(req,res) =>{
    try{
        const {senderId,recieverId} = req.body

        const isChatExist = await chats.findOne({members:{$all:[senderId,recieverId]}})

        if(isChatExist){
            return res.status(200).send({isChatExist})
        }

        const newChat = await chats.create({members:[senderId,recieverId]})
        res.status(200).send({newChat})

    } catch(error){
        console.log('error in createChat', error);
        res.status(500).send({error})
    }
}

const findAllChatsOfOneUser = async(req,res) =>{
    try{
        const {_id} = req.params;
        const findChat = await chats.find({members:{$in:[_id]}}).populate({path:'members',select:{password:0,frineds:0,follower:0, cover:0, profile:0}})
        res.status(200).send({chat:findChat})
    }
    catch(error){
        console.log('error in findAllChatsOfOneUser', error);
        res.status(200).send({error})
    }
}

const findChatOfSpecificUser = async(req,res) =>{
    const {senderId,recieverId} = req.body;

    const chat = await chats.find({members:{$all:[senderId,recieverId]}})
    res.status(200).send({chat})
}

const sendMessages = async(req,res) =>{
    try{
        const {senderId, recevierId, chatId, message} = req.body
        const messageAvailable = await messages.create(req.body)
        res.status(200).send({message:messageAvailable})

    }catch(error){
        console.log('error in sendMessage', sendMessages);
        res.status(400).send({error})
    }
}

const getMessages = async(req,res) =>{
    try{
        const {_id} = req.params
        const messageAvailable = await messages.find({chatId:_id})
        res.status(200).send({message:messageAvailable}) 
    }
    catch(error){
        console.log('error in getMessage', getMessages)
    }
}

const getAllUsers = async(req,res)=>{
    try{
         const allUsers = await User.find({}).select({password:0,profile:0,cover:0,frineds:0,follower:0})
         res.status(200).send({allUsers})

    }catch(error){
        console.log('error in getAllUsers',getAllUsers)
        res.status(400).send({error})
    }
}

module.exports= {createChat,findAllChatsOfOneUser,findChatOfSpecificUser,sendMessages,getMessages,getAllUsers}
const express = require("express");
const router = express.Router();
const { requireSignIn } = require("../middleware/authMiddleware");
const {createChat,findAllChatsOfOneUser,findChatOfSpecificUser,sendMessages,getMessages} = require('../controllers/ChatController')

router.post('/create-chat',createChat);
router.post('/find-specific-chat',findChatOfSpecificUser);
router.post('/send-message',sendMessages);
router.get('/get-chat/:_id',findAllChatsOfOneUser);
router.get('/get-message/:_id',getMessages);

module.exports = router
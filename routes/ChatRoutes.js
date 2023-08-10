const express = require("express");
const router = express.Router();
const { requireSignIn } = require("../middleware/authMiddleware");
const {createChat,findAllChatsOfOneUser,findChatOfSpecificUser,sendMessages,getMessages,getAllUsers,updateUnreadCount} = require('../controllers/ChatController')

router.post('/create-chat',createChat);
router.post('/find-specific-chat',findChatOfSpecificUser);
router.post('/send-message',sendMessages);
router.post('/update-unread-count',updateUnreadCount);
router.get('/get-chat/:_id',findAllChatsOfOneUser);
router.get('/get-message/:_id',getMessages);
router.get('/get-all-users',getAllUsers);

module.exports = router
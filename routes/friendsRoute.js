const { requireSignIn } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const {getAllUsers,sendFollowRequest} = require('../controllers/friendsController')

router.get("/blog-users/:_id", requireSignIn, getAllUsers);
router.post("/follow-request", requireSignIn, sendFollowRequest);

module.exports = router;

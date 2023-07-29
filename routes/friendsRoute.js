const { requireSignIn } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const {getAllUsers,sendFollowRequest,sendUnFollowRequest} = require('../controllers/friendsController')

router.get("/blog-users/:_id", requireSignIn, getAllUsers);
router.post("/follow-request", requireSignIn, sendFollowRequest);
router.post("/unfollow-request", requireSignIn, sendUnFollowRequest);

module.exports = router;

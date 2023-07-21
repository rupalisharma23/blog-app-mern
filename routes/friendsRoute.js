const { requireSignIn } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const {getAllUsers,sendFollowRequest,getFollowRequest,deleteFollowRequest,acceptFollowRequest} = require('../controllers/friendsController')

router.get("/blog-users/:_id", requireSignIn, getAllUsers);
router.post("/follow-request", requireSignIn, sendFollowRequest);
router.post("/delete-follow-request", requireSignIn, deleteFollowRequest);
router.post("/accept-follow-request", requireSignIn, acceptFollowRequest);
router.get("/get-follow-request/:_id", requireSignIn, getFollowRequest);

module.exports = router;

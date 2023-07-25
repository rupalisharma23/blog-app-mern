const {requireSignIn} = require('../middleware/authMiddleware');
const {createBlogController,getAllBlogController,getSingleBlog,editSingleBlog,deleteSingleBlog,getPersonalBlogController,addComments,deleteComment,likeController} = require('../controllers/blogController')
const express = require('express');
const router = express.Router();

router.post("/create-blog", requireSignIn, createBlogController);
router.get("/get-blog/:_id", requireSignIn, getAllBlogController);
router.get("/single-blog/:_id", requireSignIn, getSingleBlog);
router.post("/single-blog/:_id", requireSignIn, editSingleBlog);
router.delete("/single-blog/:_id", requireSignIn, deleteSingleBlog);
router.get("/personal-blog/:_id", requireSignIn, getPersonalBlogController);
router.post("/add-comments/:_id",requireSignIn,addComments)
router.post("/delete-comments",requireSignIn,deleteComment)
router.post("/like/:_id",requireSignIn,likeController)

module.exports = router
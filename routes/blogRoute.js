const {requireSignIn} = require('../middleware/authMiddleware');
const {createBlogController,getAllBlogController} = require('../controllers/blogController')
const express = require('express');
const router = express.Router();

router.post("/create-blog", requireSignIn, createBlogController);
router.get("/get-blog", requireSignIn, getAllBlogController);

module.exports = router
const express = require("express");
const {requireSignIn} = require('../middleware/authMiddleware');
const router = express.Router();
const { SignIn, login,SignInGoogle,forgotPassword,resetPassword,updateProfile } = require("../controllers/userController");

router.post("/register", SignIn);
router.post("/register/google", SignInGoogle);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-profile/:_id", requireSignIn, updateProfile);

module.exports = router;

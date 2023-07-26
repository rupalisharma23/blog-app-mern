const express = require("express");
const router = express.Router();
const { SignIn, login,SignInGoogle,forgotPassword,resetPassword } = require("../controllers/userController");

router.post("/register", SignIn);
router.post("/register/google", SignInGoogle);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

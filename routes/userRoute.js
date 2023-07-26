const express = require("express");
const router = express.Router();
const { SignIn, login,SignInGoogle } = require("../controllers/userController");

router.post("/register", SignIn);
router.post("/register/google", SignInGoogle);
router.post("/login", login);

module.exports = router;

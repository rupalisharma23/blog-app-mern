const express = require("express");
const router = express.Router();
const { SignIn, login } = require("../controllers/userController");

router.post("/register", SignIn);
router.post("/login", login);

module.exports = router;

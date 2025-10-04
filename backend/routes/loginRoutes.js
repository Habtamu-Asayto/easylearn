const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
router.post("/api/user/login", loginController.logIn);

module.exports = router;

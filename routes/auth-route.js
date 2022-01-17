const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth-controller")
const { isLogin } = require("../middlewares/auth")

router.post('/register', register)
router.post('/login', login)

module.exports = router
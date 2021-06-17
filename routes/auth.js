const express = require('express');
const router = express.Router();
const {register, login, verify} = require("../controllers/auth");

router.post('/register' , register);                        //POST request to register the user
router.post('/login' , login);                              // POST request to login the user
router.put('/verify/:otp/:email', verify);                  //PUT request to verify the email of the user

module.exports = router;
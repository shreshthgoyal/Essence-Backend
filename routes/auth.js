//Required all the modules
const express = require('express');
const router = express.Router();
const {register} = require("../controllers/register");
const {verify} = require("../controllers/verify");
const {login} = require("../controllers/login");
const {info} = require("../controllers/info");
const {event} = require("../controllers/uevent");
const {pronite} = require("../controllers/upronite");
const {goodies} = require("../controllers/ugoodies");
const { verifym } = require("../middleware/authmiddleware");


router.post('/register' , register);                        //POST request to register the user
router.post('/login' , login);                              // POST request to login the user
router.put('/verify/:token', verify);                  //PUT request to verify the email of the user
router.get('/dashboard', verifym, info);              //GET request to get the information for user panel
router.get('/event', verifym, event);              //GET request to get the information for user panel
router.get('/pronite', verifym, pronite);              //GET request to get the information for user panel
router.get('/goodies', verifym, goodies);              //GET request to get the information for user panel


module.exports = router;

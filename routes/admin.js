const express = require('express');
const router = express.Router();
const {login} = require("../controllers/adminlogin");
const {users} = require("../controllers/users");
const {events} = require("../controllers/events");
const {goodies} = require("../controllers/goodies");
const {pronites} = require("../controllers/pronites");
const { verifym } = require("../middleware/authmiddleware");

router.post('/login', login);                              // POST request to login the user
router.get('/users', verifym, users)                                //GET request to get info of all the users
router.get('/events', verifym, events)                                //GET request to get info of all the events
router.get('/goodies', verifym, goodies)                                //GET request to get info of all the goodies
router.get('/pronites', verifym, pronites)                                //GET request to get info of all the pronites


module.exports = router;
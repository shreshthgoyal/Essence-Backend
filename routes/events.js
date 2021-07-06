//Required all the modules
const express = require('express');
const router = express.Router();
const {eventRegister} = require("../controllers/eventregn");
const {eventUnregister} = require("../controllers/eventunregister");
const {verifym} = require("../middleware/authmiddleware");
const {eventIdParam} = require("../middleware/eventsMiddleware");

router.param("eventid", eventIdParam);

router.post("/eventregn/:eventid", verifym, eventRegister);                 //POST request to register for an event
router.delete("/eventunregister/:eventid", verifym, eventUnregister);      //DELETE request to unregister from an event

module.exports = router;
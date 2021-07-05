const express = require('express');
const router = express.Router();
const {eventRegister} = require("../controllers/eventregn");
const {eventUnregister} = require("../controllers/eventunregister");
const {verifym} = require("../middleware/authmiddleware");
const {eventIdParam} = require("../middleware/eventsMiddleware");

router.param("eventid", eventIdParam);

router.post("/eventregn/:eventid", verifym, eventRegister);
router.delete("/eventunregister/:eventid", verifym, eventUnregister);

module.exports = router;
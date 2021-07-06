//Required all the modules
const express = require("express");
const router = express.Router();
const { goodiePurchase } = require("../controllers/goodiepurchase");
const { verifym } = require("../middleware/authmiddleware");
const { goodieIdParam } = require("../middleware/goodiesMiddleware");

router.param("goodieid", goodieIdParam);

router.post("/goodiepurchase/:goodieid", verifym, goodiePurchase);          //Post request for user to buy goodies

module.exports = router;

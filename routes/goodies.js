const express = require("express");
const router = express.Router();
const { goodiePurchase } = require("../controllers/goodiepurchase");
const { verifym } = require("../middleware/authmiddleware");
const { goodieIdParam } = require("../middleware/goodiesMiddleware");

router.param("goodieid", goodieIdParam);

router.post("/goodiepurchase/:goodieid", verifym, goodiePurchase);

module.exports = router;

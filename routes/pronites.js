const express = require("express");
const router = express.Router();
const { proniteRegister } = require("../controllers/proniteRegn");
const { verifym } = require("../middleware/authmiddleware");
const { proniteIdParam } = require("../middleware/pronitesMiddleware");

router.param("proniteid", proniteIdParam);

router.post("/proniteRegn/:proniteid", verifym, proniteRegister);

module.exports = router;

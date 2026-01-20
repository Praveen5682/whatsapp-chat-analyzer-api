const express = require("express");
const router = express.Router();

router.use("/", require("../models/router/index"));

module.exports = router;

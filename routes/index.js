const express = require("express");
const router = express.Router();

// Chat
router.use("/chat", require("../models/chat/router/index"));

module.exports = router;

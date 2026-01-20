const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const upload = require("../../../config/multerConfig"); // import the config

router.post("/upload", upload.single("file"), controller.uploadChat);

module.exports = router;

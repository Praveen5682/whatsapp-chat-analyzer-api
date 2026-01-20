const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, "");
    cb(null, name + "-" + Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/plain") {
    cb(null, true);
  } else {
    cb(new Error("Only text files are allowed"), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;

const mongoose = require("mongoose");

mongoose
  .connect()
  .then(() => {
    console.log("DB Connected SuccessFully");
  })
  .catch((err) => {
    console.log("DB Connection Failed", err);
  });

const mongoose = require("mongoose");

const dbConnection = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Db Connected SucessFully! ❤️");
    })
    .catch((err) => {
      console.log("Database Connection Error : ", err);
    });
};

module.exports = dbConnection;

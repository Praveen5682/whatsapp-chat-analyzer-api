const express = require("express");
require("dotenv").config();
const router = require("./routes");
const dbConnection = require("./config/db");
const cors = require("cors");

dbConnection();

const app = express();

const port = process.env.DB_PORT || 4000;

// Middlewares

app.use(express.json());
app.use(
  cors({
    credentials: true,
  }),
);

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const router = require("./routers/router");
require("dotenv").config();
mongoose.set("strictQuery", true);

const app = express();
app.use(express.json());
app.use(multer().any());
app.use(cors());

mongoose
  .connect(process.env.Mongo_Url)
  .then(() => console.log("mongoDB is connected"))
  .catch((error) => console.error(error));

app.use("/", router);

app.listen(process.env.Port, () => {
  console.log("Express app running on port " + process.env.Port);
});

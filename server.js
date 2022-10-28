// npm packages
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ejs = require("ejs");
dotenv.config();
const Product = require("./model/product");
// mongodb connection
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);
// middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// routes
app.use("/", require("./routes/index"));

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});

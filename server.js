// npm packages
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
dotenv.config();
const Product = require("./model/product");
// mongodb connection
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);
// middlewares
app.use(bodyParser.urlencoded({ limit: '4mb', extended: false }))
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'))



// routes
app.use("/", require("./routes/index"));

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});

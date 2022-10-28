const express = require("express");
const route = express.Router();
const Product = require("../model/product");

// GET home page
route.get("/", async (req, res) => {
  if(req.body.page && req.body.limit){
    const page = parseInt(req.body.page);
    const limit = parseInt(req.body.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const products = await Product.find().limit(limit).skip(startIndex).exec();
    results.results = products;
    if (endIndex < await Product.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }
    res.render("index", { allProducts: results });
  }else{
  const allProducts = await Product.find();
  return res.render("index", { allProducts: allProducts });
  }
});

// POST home page
route.post("/", async (req, res) => {
  const { name, price, description, image } = req.body;
  await Product.create({
    name: name,
    price: price,
    description: description,
    // image: image,
  }).then(() => {
    console.log("Product created");
  });
  res.redirect("/");
});

// // PUT home page
route.get("/update/:id", (req, res) => {
  const { name, price, description, image } = req.body;
  Product.findByIdAndUpdate(req.params.id, 
  {
    name: name,
    price: price,
    description: description,
    // image: image,
  }).then(() => {
    console.log("Product updated");
  });
  res.redirect("/");
});

// // DELETE home page
route.get("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = route;

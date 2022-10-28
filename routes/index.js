const express = require("express");
const route = express.Router();
const Product = require("../model/product");

// GET home page
route.get("/", async (req, res) => {
  const allProducts = await Product.find();
  res.render("index", { allProducts: allProducts });
});
// POST pagination data
route.post("/paginationData", async (req, res) => {
  const { page, limit } = req.body;
  res.redirect(`/${page}/${limit}`);
});
// GET pagination data
route.get("/:page/:limit", async (req, res) => {
  const { page, limit } = req.params;
  const results = await Product.find().limit(limit*1).skip((page-1)*limit);
  res.render("index", { allProducts: results });
});
// POST home page/ Add product
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

// // PUT home page / Update product
route.get("/update/:id", (req, res) => {
  const { name, price, description, image } = req.body;
  Product.findByIdAndUpdate(req.params.id, {
    name: name,
    price: price,
    description: description,
    // image: image,
  }).then(() => {
    console.log("Product updated");
  });
  res.redirect("/");
});

// DELETE home page / Delete product
route.get("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id).then(() => {
    console.log("Product deleted");
  });
  res.redirect("/");
});

module.exports = route;

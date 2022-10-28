const express = require("express");
const route = express.Router();
const Product = require("../model/product");
const imageMimeTypes = ["image/jpeg", "image/png", "images/jpg"];

// GET home page, render all products
route.get("/", async (req, res) => {
  const allProducts = await Product.find().sort({ createdAt: "desc" });
  res.render("index", { allProducts: allProducts });
});
// get single product by id
route.get("/update/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("edit", { product: product });
});
// Update product by id
route.put("/update/:id", async(req, res, next) => {
    req.product = await Product.findById(req.params.id)
    next()
  }, saveProductAndRedirect())
// DELETE home page / Delete product
route.get("/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id).then(() => {
    console.log("Product deleted");
  });
  res.redirect("/");
});
// POST pagination data
route.post("/paginationData", async (req, res) => {
  const { page, limit } = req.body;
  res.redirect(`/${page}/${limit}`);
});
// GET pagination data
route.get("/:page/:limit", async (req, res) => {
  const { page, limit } = req.params;
  const results = await Product.find()
    .limit(limit * 1)
    .skip((page - 1) * limit);
  res.render("index", { allProducts: results });
});
// POST home page/ Add product
route.post("/",
  async (req, res, next) => {
    req.product = new Product();
    next();
  },
  saveProductAndRedirect()
);

//save product and redirect
function saveProductAndRedirect() {
  return async (req, res) => {
    let product = req.product;
    product.name = req.body.name;
    product.desc = req.body.desc;
    product.price = req.body.price;
    saveCover(product, req.body.cover);
    try {
      product = await product.save();
      res.redirect("/");
    } catch (error) {
      console.log("error")
      res.send(error);
    }
  };
}
//save cover as buffer
function saveCover(product, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    product.coverImage = new Buffer.from(cover.data, "base64");
    product.coverImageType = cover.type;
  }
}

module.exports = route;

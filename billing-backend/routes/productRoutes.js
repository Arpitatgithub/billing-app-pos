const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


// ➕ Add Product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/bulk', async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 📦 Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
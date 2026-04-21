const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Product = require('../models/Product'); // 👈 ADD THIS

// ➕ Create Bill
router.post('/', async (req, res) => {
  try {
    const items = req.body.items;

    let total = 0;
    let finalItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      finalItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    const bill = new Bill({
      items: finalItems,
      totalAmount: total
    });

    await bill.save();

    res.json({
      message: "Bill created securely ✅",
      totalAmount: total
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📜 Get All Bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
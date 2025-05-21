const Product = require('../models/Product');

// Get all products with supplier populated
exports.getStock = async (req, res) => {
  try {
    const { supplier, name } = req.query;
    const filter = {};
    if (supplier) filter.supplier = supplier;
    if (name) filter.name = { $regex: name, $options: 'i' };

    const products = await Product.find(filter)
      .populate('supplier', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stock', error: err.message });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update stock', error: err.message });
  }
};


// Add product with supplier reference
const Product = require('../models/Product');

// Helper function to generate unique product code
const generateProductCode = async () => {
  const count = await Product.countDocuments(); // count existing products
  const nextNumber = count + 1;
  return `PO-${nextNumber.toString().padStart(6, '0')}`; // e.g., PO-000001
};

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      pbrand,
      pcolor,
      psize,
      pweight,
      pdimensions,
      category,
      purchaseprice,
      sellingprice,
      stock,
      supplier,
    } = req.body;

    const pcode = await generateProductCode();

    const product = await Product.create({
      name,
      pcode,
      description,
      pbrand,
      pcolor,
      psize,
      pweight,
      pdimensions,
      category,
      purchaseprice,
      sellingprice,
      stock,
      supplier,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all products and populate supplier
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier', 'name company');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Stock update (manual modification)
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.stock = stock;
    product.updatedAt = new Date();
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update stock' });
  }
};

// Get reorder list (products below reorder level)
exports.reorderList = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 10 } }); // 🔁 or use `reorderLevel` if defined
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reorder list' });
  }
};


/////////controller to filter products by supplier:

// Get products by supplier
exports.getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const products = await Product.find({ supplier: supplierId }).populate('supplier', 'name company');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products by supplier' });
  }
};

// ...existing code...

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('supplier', 'name company');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// ...existing code...

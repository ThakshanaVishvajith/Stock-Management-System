const Supplier = require('../models/Supplier');


const generateSupplierCode = async () => {
  const count = await Supplier.countDocuments(); // count existing products
  const nextNumber = count + 1;
  return `SO-${nextNumber.toString().padStart(6, '0')}`; // e.g., SO-000001
};

// Create
exports.addSupplier = async (req, res) => {
  try {
    const scode = await generateSupplierCode();
    const supplierData = {
      ...req.body,
      scode, // 👈 add scode to the data
    };
    const supplier = await Supplier.create(supplierData);
    
    res.status(201).json(supplier);
  } catch (err) {
    console.error("Create Supplier Error:", err); 
    
    res.status(400).json({ message: err.message });
  }
};



// Read all
exports.getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
};

// Update
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

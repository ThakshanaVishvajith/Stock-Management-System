const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');



const generateSalesOrderCode = async () => {
  const count = await SalesOrder.countDocuments(); // count existing sales orders
  const nextNumber = count + 1;
  return `SA-${nextNumber.toString().padStart(6, '0')}`; // e.g., SO-000001
};

exports.generateSalesOrderCode = generateSalesOrderCode;

// ✅ Create and reduce stock
exports.createSalesOrder = async (req, res) => {
  const {
    customer, customerName, customerPhone, deliveryAddress, currency, paymentTerms,
    items, salesDiscount, salesOrderDate, requiredDate, subTotal, salesordercode
  } = req.body;

  try {
    // Build items with product details
    const itemsWithDetails = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      return {
        product: item.product,
        productName: product.name,
        productCode: product.pcode,
        description: product.description,
        sellingPrice: product.sellingprice,
        quantity: item.quantity,
        amount: item.quantity * product.sellingprice
      };
    }));

    // Create the sales order with all fields
    const order = await SalesOrder.create({
      customer,
      customerName,
      customerPhone,
      deliveryAddress,
      currency,
      paymentTerms,
      items: itemsWithDetails,
      salesDiscount,
      salesOrderDate,
      requiredDate,
      subTotal,
      salesordercode
    });

    // Reduce stock for each product
 

        for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = (product.stock || 0) - Number(item.quantity);
        await product.save();
      }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Sales order failed', error: err.message });
  }
};

// ✅ Get all sales orders
exports.getAllSalesOrders = async (req, res) => {
  try {
    const orders = await SalesOrder.find().populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load sales orders', error: err.message });
  }
};

// ✅ Update and revert+apply stock
exports.updateSalesOrder = async (req, res) => {
  const { id } = req.params;
  const { customerName, items } = req.body;

  try {
    const oldOrder = await SalesOrder.findById(id);
    if (!oldOrder) return res.status(404).json({ message: 'Order not found' });

    // Revert old stock
    for (const item of oldOrder.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = (product.stock || 0) + Number(item.quantity);
        await product.save();
      }
    }

    // Update order
    const updatedOrder = await SalesOrder.findByIdAndUpdate(id, { customerName, items }, { new: true });

    // Apply new stock changes
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = (product.stock || 0) - Number(item.quantity);
        await product.save();
      }
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update sales order', error: err.message });
  }
};

// ✅ Delete and revert stock
exports.deleteSalesOrder = async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = (product.stock || 0) + Number(item.quantity);
        await product.save();
      }
    }

    await SalesOrder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sales order deleted and stock restored' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete sales order', error: err.message });
  }
};

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SalesLayout from '../layout/SalesLayout';
import { AuthContext } from '../context/AuthContext';

const SalesOrderPage = () => {
  const { token } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState('');
  const [customerDetails, setCustomerDetails] = useState({});
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    product: '',
    quantity: 1
  });
  const [salesDiscount, setSalesDiscount] = useState(0);
  const [salesOrderDate, setSalesOrderDate] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [salesordercode, setSalesOrderCode] = useState('');
  const [message, setMessage] = useState('');
const [createdOrder, setCreatedOrder] = useState(null);


  // Fetch customers and products
  useEffect(() => {
    const fetchData = async () => {
      const [custRes, prodRes] = await Promise.all([
        axios.get('http://localhost:5000/api/customers', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/products', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    };
    fetchData();
  }, [token]);

  // When customer changes, set details
  useEffect(() => {
    if (customer) {
      const c = customers.find(cu => cu._id === customer);
      setCustomerDetails(c || {});
    } else {
      setCustomerDetails({});
    }
  }, [customer, customers]);

  // Calculate subtotal
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    setSubTotal(total);
  }, [items]);

  // Handle adding a product to items
    const handleAddItem = async () => {
    if (!newItem.product || !newItem.quantity) return;
  
    let code = salesordercode;
    if (!code) {
      try {
        const res = await axios.get('http://localhost:5000/api/sales-orders/generate-code', {
          headers: { Authorization: `Bearer ${token}` }
        });
        code = res.data.code;
        setSalesOrderCode(code); // Save it in state for the order
      } catch (err) {
        code = '';
      }
    }
  
    const prod = products.find(p => p._id === newItem.product);
    if (!prod) return;
    const item = {
      product: prod._id,
      productName: prod.name,
      productCode: prod.pcode,
      description: prod.description,
      sellingPrice: prod.sellingprice,
      quantity: Number(newItem.quantity),
      amount: Number(newItem.quantity) * prod.sellingprice,
      salesordercode: code // Always use the local code variable
    };
    setItems([...items, item]);
    setNewItem({ product: '', quantity: 1 });
  };

  // Handle removing an item
  const handleRemoveItem = idx => {
    setItems(items.filter((_, i) => i !== idx));
  };

  // Handle submit sales order
    const handleSubmit = async e => {
    e.preventDefault();
    if (!customer || items.length === 0 || !salesOrderDate) {
      setMessage('Please fill all required fields.');
      return;
    }
    let code = salesordercode;
    if (!code) {
      try {
        const res = await axios.get('http://localhost:5000/api/sales-orders/generate-code', {
          headers: { Authorization: `Bearer ${token}` }
        });
        code = res.data.code;
        setSalesOrderCode(code);
      } catch (err) {
        setMessage('Failed to generate sales order code.');
        return;
      }
    }
    try {
      const res = await axios.post('http://localhost:5000/api/sales-orders', {
        customer,
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        deliveryAddress: customerDetails.deliveryaddress,
        currency: customerDetails.currency,
        paymentTerms: customerDetails.paymentterms,
        items,
        salesDiscount: Number(salesDiscount) || 0,
        salesOrderDate,
        requiredDate,
        subTotal,
        salesordercode: code
      }, { headers: { Authorization: `Bearer ${token}` } });
      setCreatedOrder(res.data);
      setMessage('Sales order created!');
      setItems([]);
      setSalesOrderCode('');
    } catch (err) {
      setMessage('Error creating sales order.');
    }
  };

  return (
    <SalesLayout>
      <div className="products-page">
        <h2>Create Sales Order</h2>
        {message && <div style={{ marginBottom: 12, color: '#2563eb' }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="po-section-card">
            <div className="po-form-grid">
              <label>
                Customer
                <select value={customer} onChange={e => setCustomer(e.target.value)} required>
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Phone
                <input value={customerDetails.phone || ''} readOnly />
              </label>
              <label>
                Delivery Address
                <input value={customerDetails.deliveryaddress || ''} readOnly />
              </label>
              <label>
                Currency
                <input value={customerDetails.currency || ''} readOnly />
              </label>
              <label>
                Payment Terms
                <input value={customerDetails.paymentterms || ''} readOnly />
              </label>
              <label>
                Sales Order Code
                <input value={salesordercode} onChange={e => setSalesOrderCode(e.target.value)} placeholder="Auto or Manual" />
              </label>
              <label>
                Sales Order Date
                <input type="date" value={salesOrderDate} onChange={e => setSalesOrderDate(e.target.value)} required />
              </label>
              <label>
                Required Date
                <input type="date" value={requiredDate} onChange={e => setRequiredDate(e.target.value)} />
              </label>
              <label>
                Sales Discount
                <input
  type="number"
  value={salesDiscount}
  onChange={e => setSalesDiscount(e.target.value)}
  min={0}
/>
              </label>
            </div>
          </div>

          <div className="po-section-card">
            <h3>Add Product</h3>
            <div className="po-form-grid">
              <label>
                Product
                <select value={newItem.product} onChange={e => setNewItem({ ...newItem, product: e.target.value })}>
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Quantity
                <input type="number" value={newItem.quantity} min={1} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} />
              </label>
              <button type="button" onClick={handleAddItem}>Add Item</button>
            </div>
          </div>

          <div className="po-section-card">
            <h3>Order Items</h3>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Sales Order Code</th>
                  <th>Product</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                     <td>{item.salesordercode}</td>
                    <td>{item.productName}</td>
                    <td>{item.productCode}</td>
                    <td>{item.description}</td>
                    <td>{item.sellingPrice}</td>
                    <td>{item.quantity}</td>
                    <td>{item.amount}</td>
                    <td>
                      <button type="button" onClick={() => handleRemoveItem(idx)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, fontWeight: 'bold' }}>
              Subtotal: {subTotal}
            </div>
          </div>

          <button type="submit" className="save-btn">Submit Sales Order</button>
        </form>

                 {createdOrder && (
          <div id="invoice-section" className="po-section-card" style={{ background: "#fff", marginTop: 24 }}>
            <h3>Sales Invoice</h3>
            <p><strong>Sales Order Number:</strong> {createdOrder.salesordercode}</p>
            <p><strong>Invoice Date:</strong> {createdOrder.salesOrderDate ? new Date(createdOrder.salesOrderDate).toLocaleDateString() : ''}</p>
            <p><strong>Customer Name:</strong> {createdOrder.customerName}</p>
            <p><strong>Delivery Address:</strong> {createdOrder.deliveryAddress}</p>
            <p><strong>Payment Terms:</strong> {createdOrder.paymentTerms}</p>
            <p><strong>Required Date:</strong> {createdOrder.requiredDate ? new Date(createdOrder.requiredDate).toLocaleDateString() : ''}</p>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {createdOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.productCode}</td>
                    <td>{item.productName}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12, fontWeight: 'bold' }}>
              Subtotal: {createdOrder.subTotal}
            </div>
            <button onClick={() => window.print()}>Print Invoice</button>
          </div>
        )}


      </div>
    </SalesLayout>
  );
};

export default SalesOrderPage;
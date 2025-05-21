// Full working PurchaseOrdersPage component
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';
import '../styles/Management.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const PurchaseOrdersPage = () => {
  const { token } = useContext(AuthContext);

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [supplier, setSupplier] = useState('');
  const [scode, setScode] = useState('');
  const [scurrency, setScurrency] = useState('');
  const [spaymentdescription, setSpaymentdescription] = useState('');
  const [sbankname, setSbankname] = useState('');
  const [sbankaccount, setSbankaccount] = useState('');

  const [orderDate, setOrderDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryName, setDeliveryName] = useState('');
  const [supplierInvoiceDate, setSupplierInvoiceDate] = useState('');

  const [newItem, setNewItem] = useState({
    product: '', name: '', pcode: '', description: '',
    quantity: 1, purchaseprice: '', amount: '',
    taxRate: '', purchaseTotal: ''
  });

  const [items, setItems] = useState([]);
  const [invoice, setInvoice] = useState(null);



  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    const res = await axios.get('http://localhost:5000/api/suppliers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuppliers(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);

  };


const [company, setCompany] = useState({ name: '', phone: '', email: '', address: '' });

useEffect(() => {
  // ...existing fetchSuppliers and fetchProducts...
  const fetchCompany = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/company', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) setCompany(res.data);
    } catch (err) {
      setCompany({ name: '', phone: '', email: '', address: '' });
    }
  };
  fetchCompany();
}, [token]);


























 const handleAddItem = () => {
  if (!newItem.product || newItem.quantity < 1) return alert('Select product and quantity');
  const selected = products.find(p => p._id === newItem.product);
  const amount = newItem.quantity * newItem.purchaseprice;
  const taxAmount = amount * (Number(newItem.taxRate) / 100 || 0);
  const total = amount + taxAmount;

  setItems([...items, {
    ...newItem,
    product: selected._id, // <-- This is important!
    name: selected.name,
    pcode: selected.pcode, // Use pcode, not productCode, to match your backend model
    description: selected.description,
    amount,
    taxRate: Number(newItem.taxRate),
    purchaseTotal: total,
    supplierInvoiceDate,
    deliveryName,
    orderDate,
    deliveryDate,
    scurrency,
    spaymentdescription,
    sbankname,
    sbankaccount,
  }]);

  setNewItem({ product: '', name: '', pcode: '', description: '', quantity: 1, purchaseprice: '', amount: '', taxRate: '', purchaseTotal: '' });
};

  const handleDeleteItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleEditItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'quantity' ? Number(value) : value;
    setItems(updated);
  };

 const handleSubmit = async () => {
  // Validate required fields
  if (
    !supplier ||
    !scode ||
    !supplierInvoiceDate ||
    !deliveryName ||
    !orderDate ||
    !scurrency ||
    !spaymentdescription ||
    !sbankname ||
    !sbankaccount ||
    items.length === 0
  ) {
    alert('Please fill all required fields and add at least one item.');
    return;
  }

  // Validate items
  for (const item of items) {
    if (
      !item.product ||
      !item.name ||
      !item.pcode ||
      !item.quantity ||
      !item.purchaseprice ||
      !item.amount ||
      !item.purchaseTotal
    ) {
      alert('Each item must have product, name, code, quantity, price, amount, and total.');
      return;
    }
  }

  const payload = {
    supplier,
    scode,
    supplierInvoiceDate: supplierInvoiceDate ? new Date(supplierInvoiceDate) : null,
    deliveryName,
    orderDate: orderDate ? new Date(orderDate) : null,
    deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
    scurrency,
    spaymentdescription,
    sbankname,
    sbankaccount,
    items
  };

  try {
    const res = await axios.post('http://localhost:5000/api/purchase-orders', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setInvoice(res.data);
    setSupplier('');
    setItems([]);
  } catch (error) {
    alert(error?.response?.data?.message || error.message);
    console.error(error);
  }
};

const handlePrintInvoice = () => {
  if (!invoice) return;
  const win = window.open('', 'PRINT', 'height=600,width=800');
  win.document.write(`
    <html><head><title>Invoice</title></head><body>
    <h3>Invoice - ${invoice._id}</h3>
    <p><strong>Order ID:</strong> ${invoice._id}</p>
    <p><strong>Order Date:</strong> ${invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString() : ''}</p>
    <p><strong>Supplier:</strong> ${invoice.supplier?.name || invoice.supplier}</p>
    <p><strong>Delivery Date:</strong> ${invoice.deliveryDate ? new Date(invoice.deliveryDate).toLocaleDateString() : ''}</p>
    <p><strong>Status:</strong> ${invoice.status}</p>
    <p><strong>Created:</strong> ${new Date(invoice.createdAt).toLocaleString()}</p>
    <table border="1">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Tax %</th>
          <th>Purchase Total</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items.map(i => `
          <tr>
            <td>${i.name}</td>
            <td>${i.quantity}</td>
            <td>${i.taxRate}</td>
            <td>${i.purchaseTotal}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    </body></html>
  `);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};


const handleDownloadPDF = () => {
  if (!invoice) return;
  const doc = new jsPDF();

  // Company Info
  doc.setFontSize(16);
  doc.text(company.name || 'Company Name', 14, 20);
  doc.setFontSize(10);
  doc.text(company.address || 'Company Address', 14, 26);
  doc.text(`Phone: ${company.phone || '-'}`, 14, 31);
  doc.text(`Email: ${company.email || '-'}`, 14, 36);
  doc.text(`address: ${company.address || '-'}`, 14, 41);
  // Invoice Title
  doc.setFontSize(14);
  doc.text('Purchase Invoice', 150, 20, { align: 'right' });
  doc.setFontSize(11);
doc.setFontSize(11);
doc.text(
  `Invoice #: ${invoice.purchasecode || invoice._id}`,
  150, // X position (right margin)
  28,  // Y position
  { align: 'right' }
);
  // Draw line
  doc.setLineWidth(0.5);
  doc.line(11, 33, 196, 33);

  // Invoice Meta Info
  doc.setFontSize(11);
  
  doc.text(`Status: ${invoice.status}`, 14, 46);
  doc.text(`Order Date: ${invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString() : ''}`, 14, 52);
  doc.text(`Created: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 58);

  // Supplier & Delivery Info (right column)
  doc.text(`Supplier: ${invoice.supplier?.name || invoice.supplier}`, 120, 40);
  doc.text(`Supplier Code: ${invoice.supplier?.scode || ''}`, 120, 46);
  doc.text(`Payment: ${invoice.spaymentdescription}`, 120, 52);
  doc.text(`Bank: ${invoice.sbankname} (${invoice.sbankaccount})`, 120, 58);
  doc.text(`Currency: ${invoice.scurrency}`, 120, 64);
  doc.text(`Delivery Name: ${invoice.deliveryName}`, 120, 70);
  doc.text(`Delivery Date: ${invoice.deliveryDate ? new Date(invoice.deliveryDate).toLocaleDateString() : ''}`, 120, 76);
  doc.text(`Supplier Invoice Date: ${invoice.supplierInvoiceDate ? new Date(invoice.supplierInvoiceDate).toLocaleDateString() : ''}`, 120, 82);

  // Items Table
  const rows = invoice.items.map(i => [
    i.name,
    i.quantity,
    i.taxRate,
    i.purchaseTotal
  ]);
  doc.autoTable({
    head: [['Item', 'Qty', 'Tax %', 'Purchase Total']],
    body: rows,
    startY: 90,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [230, 230, 230] }
  });

  // Total
  const finalY = doc.lastAutoTable.finalY || 100;
  doc.setFontSize(12);
  doc.text(
    `Total: Rs. ${invoice.items.reduce((sum, i) => sum + (i.purchaseTotal || 0), 0).toFixed(2)}`,
    196,
    finalY + 10,
    { align: 'right' }
  );

  // Optional: Signature line
  doc.setFontSize(10);
  doc.text('Authorized Signature: ______________________', 14, finalY + 25);

  doc.save(`invoice_${invoice.purchasecode || invoice._id}.pdf`);
};

  return (
    
    <div className="products-page">
      <h2>Create Purchase Order</h2>
  
      {/* Supplier & Order Details */}
      <div className="po-section-card">
        <div className="po-form-grid">
          <label>
            Supplier
            <select value={supplier} onChange={e => {
              const s = suppliers.find(s => s._id === e.target.value);
              setSupplier(e.target.value);
              setScode(s?.scode || '');
              setSpaymentdescription(s?.spaymentdescription || '');
              setSbankaccount(s?.sbankaccount || '');
              setSbankname(s?.sbankname || '');
              setScurrency(s?.scurrency || '');
            }}>
              <option value=""> Select Supplier </option>
              {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </label>
          <label>
            Supplier Code
            <input value={scode} placeholder="Supplier Code" readOnly />
          </label>
          <label>
            Payment Description
            <input value={spaymentdescription} onChange={e => setSpaymentdescription(e.target.value)} placeholder="Payment Description" />
          </label>
          <label>
            Bank Name
            <input value={sbankname} onChange={e => setSbankname(e.target.value)} placeholder="Bank Name" />
          </label>
          <label>
            Bank Account
            <input value={sbankaccount} onChange={e => setSbankaccount(e.target.value)} placeholder="Bank Account" />
          </label>
          <label>
            Currency
            <input value={scurrency} onChange={e => setScurrency(e.target.value)} placeholder="Currency" />
          </label>
        </div>
      </div>
  
      {/* Add Item Section */}
      <div className="po-section-card">
        <div className="po-form-grid">
          <label>
            Product
            <select value={newItem.product} onChange={async (e) => {
              const id = e.target.value;
              const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const p = res.data;
              setNewItem({ ...newItem, product: id, name: p.name, pcode: p.pcode, description: p.description, purchaseprice: p.purchaseprice });
            }}>
              <option value=""> Select Product </option>
              {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </label>
          <label>
            Product Code
            <input value={newItem.pcode || ''} placeholder="Code" readOnly />
          </label>
          <label>
            Description
            <input value={newItem.description} placeholder="Description" readOnly />
          </label>
          <label>
            Purchase Price
            <input
              type="number"
              value={newItem.purchaseprice || ''}
              onChange={e => setNewItem({ ...newItem, purchaseprice: e.target.value })}
              placeholder='Purchase Price'
            />
          </label>
          <label>
            Tax Rate
            <input
              type="number"
              value={newItem.taxRate || ''}
              onChange={e => setNewItem({ ...newItem, taxRate: e.target.value })}
              placeholder='Tax Rate'
            />
          </label>
          <label>
            Quantity
            <input
              type="number"
              value={newItem.quantity || 1}
              onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              placeholder='Quantity'
            />
          </label>
          <label>
            Order Date
            <input type="date" value={orderDate || ''} onChange={e => setOrderDate(e.target.value)} />
          </label>
          <label>
            Delivery Date
            <input type="date" value={deliveryDate|| ''} onChange={e => setDeliveryDate(e.target.value)} />
          </label>
          <label>
            Delivery Name
            <input value={deliveryName} onChange={e => setDeliveryName(e.target.value)} placeholder="Delivery Name" />
          </label>
          <label>
            Supplier Invoice Date
            <input type="date" value={supplierInvoiceDate} onChange={e => setSupplierInvoiceDate(e.target.value)} />
          </label>
        </div>
        <button onClick={handleAddItem}>Add Item</button>
      </div>
  
      {/* Items Table */}
      <div className="po-section-card">
        <table>
          <thead>
            <tr>
              
              <th>Item</th>
              <th>Description</th>
              <th>Price</th>
              <th>Tax %</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Purchase Total</th>
              <th>Order Date</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.purchaseprice}</td>
                <td>{item.taxRate}</td>
                <td>
                  <label>
                    Quantity
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => handleEditItem(i, 'quantity', e.target.value)}
                    />
                  </label>
                </td>
                <td>{item.amount}</td>
                <td>{item.purchaseTotal}</td>
                <td>{item.orderDate}</td>
                                <td>
                  {suppliers.find(s => s._id === supplier)?.name || supplier}
                </td>
                <td>
                  <button onClick={() => handleDeleteItem(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSubmit}>Purchase</button>
      </div>
  
      {/* Invoice Section */}
             {invoice && (
        <div className="po-section-card" style={{ background: '#fff', maxWidth: 800, margin: '24px auto', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
          {/* Header */}
          {/* ...existing code... */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 48, marginRight: 16 }} />
          <div>
            <h2 style={{ margin: 0 }}>{company.name || 'Company Name'}</h2>
            <div style={{ fontSize: 13, color: '#555' }}>
              {company.address || 'Company Address'}<br />
              Phone: {company.phone || '-'}<br />
              Email: {company.email || '-'}
            </div>
          </div>
        </div>
          {/* ...existing code... */}
          {/* Invoice Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0 }}>Purchase Invoice</h3>
              <div><strong>Invoice #:</strong> {invoice.purchasecode || invoice._id}</div>
              <div><strong>Status:</strong> {invoice.status}</div>
            </div>
            <div>
              <div><strong>Date:</strong> {invoice.orderDate ? new Date(invoice.orderDate).toLocaleDateString() : ''}</div>
              <div><strong>Created:</strong> {new Date(invoice.createdAt).toLocaleString()}</div>
            </div>
          </div>
          {/* Supplier & Delivery */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div><strong>Supplier:</strong> {invoice.supplier?.name || invoice.supplier}</div>
              <div><strong>Supplier Code:</strong> {invoice.supplier?.scode || ''}</div>
              <div><strong>Payment:</strong> {invoice.spaymentdescription}</div>
              <div><strong>Bank:</strong> {invoice.sbankname} ({invoice.sbankaccount})</div>
              <div><strong>Currency:</strong> {invoice.scurrency}</div>
            </div>
            <div>
              <div><strong>Delivery Name:</strong> {invoice.deliveryName}</div>
              <div><strong>Delivery Date:</strong> {invoice.deliveryDate ? new Date(invoice.deliveryDate).toLocaleDateString() : ''}</div>
              <div><strong>Supplier Invoice Date:</strong> {invoice.supplierInvoiceDate ? new Date(invoice.supplierInvoiceDate).toLocaleDateString() : ''}</div>
            </div>
          </div>
          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Item</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Qty</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Tax %</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Purchase Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((i, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{i.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{i.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{i.taxRate}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{i.purchaseTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Summary */}
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <strong>
              Total: Rs. {invoice.items.reduce((sum, i) => sum + (i.purchaseTotal || 0), 0).toFixed(2)}
            </strong>
          </div>
          {/* Actions */}
          <div style={{ marginTop: 24 }}>
            <button onClick={handlePrintInvoice} style={{ marginRight: 12 }}>Print</button>
            <button onClick={handleDownloadPDF}>Download PDF</button>
          </div>
        </div>
      )}
    </div>
  
  );
};

export default PurchaseOrdersPage;




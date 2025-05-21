import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/Management.css';
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProductsPage = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    pbrand: '',
    pcolor: '',
    psize: '',
    pweight: '',
    pdimensions: '',
    category: '',
    purchaseprice: '',
    sellingprice: '',
    stock: '',
    supplier: '',
    _id: null
  });

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get('http://localhost:5000/api/suppliers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuppliers(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: form.name,
      description: form.description,
      pbrand: form.pbrand,
      pcolor: form.pcolor,
      psize: form.psize,
      pweight: form.pweight,
      pdimensions: form.pdimensions,
      category: form.category,
      purchaseprice: parseFloat(form.purchaseprice),
      sellingprice: parseFloat(form.sellingprice),
      stock: parseInt(form.stock),
      supplier: form.supplier
    };

    await axios.post('http://localhost:5000/api/products', newProduct, {
      headers: { Authorization: `Bearer ${token}` },
    });
    clearForm();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const handleUpdate = async (id) => {
    const updatedProduct = {
      name: form.name,
      description: form.description,
      pbrand: form.pbrand,
      pcolor: form.pcolor,
      psize: form.psize,
      pweight: form.pweight,
      pdimensions: form.pdimensions,
      category: form.category,
      purchaseprice: parseFloat(form.purchaseprice),
      sellingprice: parseFloat(form.sellingprice),
      stock: parseInt(form.stock),
      supplier: form.supplier
    };

    await axios.put(`http://localhost:5000/api/products/${id}`, updatedProduct, {
      headers: { Authorization: `Bearer ${token}` },
    });
    clearForm();
    fetchProducts();
  };

  const clearForm = () => {
    setForm({
      name: '',
      description: '',
      pbrand: '',
      pcolor: '',
      psize: '',
      pweight: '',
      pdimensions: '',
      category: '',
      purchaseprice: '',
      sellingprice: '',
      stock: '',
      supplier: '',
      _id: null
    });
  };

  return (
    <div className="products-page">
      <h2>Products Management</h2>

      {/* Form */}
      <form className="add-product-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Brand"
          value={form.pbrand}
          onChange={(e) => setForm({ ...form, pbrand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Color"
          value={form.pcolor}
          onChange={(e) => setForm({ ...form, pcolor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Size"
          value={form.psize}
          onChange={(e) => setForm({ ...form, psize: e.target.value })}
        />
        <input
          type="text"
          placeholder="Weight"
          value={form.pweight}
          onChange={(e) => setForm({ ...form, pweight: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dimensions"
          value={form.pdimensions}
          onChange={(e) => setForm({ ...form, pdimensions: e.target.value })}
        />

        <input
          type="number"
          placeholder=" Purchase Price"
          value={form.purchaseprice}
          onChange={(e) => setForm({ ...form, purchaseprice: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder=" Selling Price"
          value={form.sellingprice}
          onChange={(e) => setForm({ ...form, sellingprice: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <select
          value={form.supplier}
          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          required
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
        <button type="submit">Add Product</button>
      </form>

      {/* Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Product Code</th>
            <th>SellingPrice</th>
            <th>Purchase Price</th>
            <th>Stock</th>
            <th>Supplier</th>
            <th>Stock On Hand Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                {form._id === p._id ? (
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                ) : (
                  p.name
                )}
              </td>
              <td>{p.pcode}</td>
              <td>
                {form._id === p._id ? (
                  <input type="number" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                ) : (
                  `Rs. ${p.sellingprice?.toFixed(2) || 0}`
                )}
              </td>
              <td>
                {form._id === p._id ? (
                  <input type="number" value={form.purchaseprice} onChange={(e) => setForm({ ...form, purchaseprice: e.target.value })} />
                ) : (
                  `Rs. ${p.purchaseprice?.toFixed(2) || 0}`
                )}
              </td>
              <td>
                {form._id === p._id ? (
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                ) : (
                  p.stock
                )}
              </td>
              <td>
                {form._id === p._id ? (
                  <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                    <option value="">-- Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                ) : (
                  p.supplier?.name || '-'
                )}
              </td>
              <td><strong>Rs. {(p.purchaseprice * p.stock || 0).toFixed(2)}</strong></td>
              <td>
                {form._id === p._id ? (
                  <>
                    <button className="save-btn" onClick={() => handleUpdate(p._id)}><FaSave /></button>
                    <button className="cancel-btn" onClick={clearForm}><FaTimes /></button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => setForm({ ...p, supplier: p.supplier?._id })}><FaEdit /></button>
                    <button className="delete-btn" onClick={() => handleDelete(p._id)}><FaTrashAlt /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
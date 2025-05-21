import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [productName, setProductName] = useState('');

  const token = localStorage.getItem('token'); // Get token from local storage

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

 const fetchProducts = async () => {
  try {
    let url = 'http://localhost:5000/api/products';
    let params = {};

    if (selectedSupplier) {
      url = `http://localhost:5000/api/products/supplier/${selectedSupplier}`;
    }
    if (productName) {
      params.name = productName;
    }

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    setProducts(res.data);
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};
  const handleStockChange = async (id, newStock) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/stock/${id}`,
        { stock: newStock },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      console.error('Stock update failed', err);
    }
  };

  return (
    
      <div className="stock-page">
        <h2>Stock Management</h2>

       <label>Filter by Supplier:</label>
<select
  value={selectedSupplier}
  onChange={(e) => setSelectedSupplier(e.target.value)}
>
  <option value="">All</option>
  {suppliers.map((s) => (
    <option key={s._id} value={s._id}>
      {s.name}
    </option>
  ))}
</select>

<input
  type="text"
  placeholder="Search by product name"
  value={productName}
  onChange={e => setProductName(e.target.value)}
  style={{ marginLeft: 8, marginRight: 8 }}
/>
<button onClick={fetchProducts}>Apply Filter</button>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Supplier</th>
              <th>Stock</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.supplier?.name}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => handleStockChange(p._id, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleStockChange(p._id, p.stock)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
  );
};

export default Stock;

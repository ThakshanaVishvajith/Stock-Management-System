import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import SalesLayout from '../layout/SalesLayout';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../layout/AdminLayout';

const SalesList = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/sales-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <AdminLayout>
      <div className="products-page">
        <h2>Sales Orders</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Sales Order Code</th>
                <th>Order Date</th>
                <th>Required Date</th>
                <th>Customer Name</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.salesordercode || order._id}</td>
                  <td>{order.salesOrderDate ? new Date(order.salesOrderDate).toLocaleDateString() : ''}</td>
                  <td>{order.requiredDate ? new Date(order.requiredDate).toLocaleDateString() : ''}</td>
                  <td>{order.customerName}</td>
                  <td>{order.subTotal !== undefined ? order.subTotal : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default SalesList;
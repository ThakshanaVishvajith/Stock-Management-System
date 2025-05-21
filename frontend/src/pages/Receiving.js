import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../layout/AdminLayout';

const ReceivingPage = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchPurchaseOrders();
    // eslint-disable-next-line
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/receiving', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/receiving/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(prev =>
        prev.map(order => (order._id === orderId ? res.data : order))
      );
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    
      <div style={{
        maxWidth: 1100,
        margin: '32px auto',
        padding: '0 16px'
      }}>
        <h2 style={{
          fontWeight: 700,
          color: '#2e7dff',
          marginBottom: 24,
          letterSpacing: 1
        }}>
          <span role="img" aria-label="receiving">📦</span> Receiving - Purchase Orders
        </h2>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #e0e0e0',
          padding: 24,
          minHeight: 300
        }}>
          {orders.length === 0 ? (
            <p style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No purchase orders found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 15
              }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 10, border: '1px solid #eee' }}>Order Code</th>
                    <th style={{ padding: 10, border: '1px solid #eee' }}>Supplier</th>
                    <th style={{ padding: 10, border: '1px solid #eee' }}>Status</th>
                    <th style={{ padding: 10, border: '1px solid #eee' }}>Created</th>
                    <th style={{ padding: 10, border: '1px solid #eee' }}>Items</th>
                    <th style={{ padding: 10, border: '1px solid #eee' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} style={{ background: '#fff' }}>
                      <td style={{ padding: 8, border: '1px solid #f0f0f0' }}>{order.purchasecode}</td>
                      <td style={{ padding: 8, border: '1px solid #f0f0f0' }}>{order.supplier?.name || 'N/A'}</td>
                      <td style={{ padding: 8, border: '1px solid #f0f0f0' }}>
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 5,
                            border: '1px solid #ccc',
                            background: order.status === 'completed' ? '#e6ffe6' : order.status === 'cancelled' ? '#ffeaea' : '#fff',
                            color: order.status === 'completed' ? 'green' : order.status === 'cancelled' ? 'crimson' : '#222',
                            fontWeight: 500
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ padding: 8, border: '1px solid #f0f0f0' }}>{new Date(order.createdAt).toLocaleString()}</td>
                      <td style={{ padding: 8, border: '1px solid #f0f0f0' }}>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {order.items.map((item, i) => (
                            <li key={i}>{item.name} - {item.quantity}</li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: 8, border: '1px solid #f0f0f0' }}>
                        <button
                          onClick={() => handleStatusChange(order._id, order.status)}
                          style={{
                            background: '#2e7dff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '7px 18px',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            boxShadow: '0 1px 4px #e0e0e0'
                          }}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default ReceivingPage;
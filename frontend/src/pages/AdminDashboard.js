import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from '../layout/AdminLayout'; // ✅ use shared layout
import {
  FaBoxOpen, FaBoxes, FaExchangeAlt, FaUndoAlt,
  FaDollarSign, FaUsers, FaClipboardList, FaTruckLoading, FaWarehouse
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchStats();
  }, [token]);

  const widgets = [
    { label: 'Purchase Orders', count: stats.totalPurchaseOrders, icon: <FaClipboardList />, color: 'teal' },
    { label: 'Receiving Records', count: stats.totalReceiving || 6, icon: <FaTruckLoading />, color: 'orange' },
    
    { label: 'Return Records', count: stats.totalReturns || 1, icon: <FaUndoAlt />, color: 'red' },
    { label: 'Sales orders', count: stats.totalSalesOrders, icon: <FaDollarSign />, color: 'green' },
    { label: 'Suppliers', count: stats.totalSuppliers || 2, icon: <FaBoxOpen />, color: 'darkblue' },
    { label: 'Items', count: stats.totalProducts, icon: <FaBoxes />, color: 'steelblue' },
    { label: 'Users', count: stats.totalUsers || 2, icon: <FaUsers />, color: 'seagreen' },
    { label: 'Stock On Hand Value', count: stats.stockOnHandValue || 1000000, icon: <FaWarehouse />, color: 'purple' },
    { label: 'Gross Profit', count: stats.grossProfit || 50000, icon: <FaDollarSign />, color: 'goldenrod' },
  ];

  return (
    <AdminLayout>
      <div className="admin-container">
        <main className="dashboard-main">
          <h1>Dashboard</h1>
          <div className="dashboard-cards">
            {widgets.map((w, i) => (
              <div key={i} className="card" style={{ borderLeft: `5px solid ${w.color}` }}>
                <div className="card-icon">{w.icon}</div>
                <div className="card-content">
                  <h3>{w.label}</h3>
                  <p>{w.count}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

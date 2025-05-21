import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
  FaDollarSign,
  FaBoxes,
  FaClipboardList,
  FaSignOutAlt
} from 'react-icons/fa';

const SalesDashboard = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalSalesOrders: 0,
    totalProducts: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/sales-rep', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      }
    };

    fetchStats();
  }, [token]);

  const cards = [
    {
      title: 'Total Sales Orders',
      count: stats.totalSalesOrders,
      icon: <FaDollarSign />,
      color: 'green',
    },
    {
      title: 'Available Products',
      count: stats.totalProducts,
      icon: <FaBoxes />,
      color: 'steelblue',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="brand">SMS - React</div>
        <div className="sidebar-user">{user?.email || 'Sales Rep'}</div>
        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li onClick={() => navigate('/sales-orders')}>
            <FaClipboardList style={{ marginRight: 8 }} />
            Sales Orders
          </li>
          
          <li onClick={() => navigate('/customers')}>
            <FaClipboardList style={{ marginRight: 8 }} />
            Customers
          </li>
          <hr />
          <li onClick={handleLogout} className="logout-link">
            <FaSignOutAlt style={{ marginRight: '8px' }} />
            Logout
          </li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <h1>Welcome, {user?.name || 'Sales Representative'}!</h1>
        <div className="dashboard-cards">
          {cards.map((card, index) => (
            <div key={index} className="card" style={{ borderLeft: `5px solid ${card.color}` }}>
              <div className="card-icon">{card.icon}</div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.count}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;

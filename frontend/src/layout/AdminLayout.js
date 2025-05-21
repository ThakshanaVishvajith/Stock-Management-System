// src/layout/AdminLayout.js
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaClipboardList, FaTruckLoading, FaExchangeAlt, FaUndoAlt,
  FaWarehouse, FaDollarSign, FaBoxOpen, FaBoxes, FaUsers, FaCogs, FaSignOutAlt
} from 'react-icons/fa';
import '../styles/Management.css';


const AdminLayout = ({ children }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <FaClipboardList /> },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: <FaClipboardList /> },
    { label: 'Receiving', path: '/receiving', icon: <FaTruckLoading /> },
    { label: 'Reports', path: '/transfer', icon: <FaExchangeAlt /> },
    { label: 'Return List', path: '/returns', icon: <FaUndoAlt /> },
    { label: 'Stocks', path: '/stocks', icon: <FaWarehouse /> },
        { label: 'Sales List', path: '/sales-list', icon: <FaDollarSign /> },
    { divider: true },
    { label: 'Suppliers', path: '/suppliers', icon: <FaBoxOpen /> },
    { label: 'Items', path: '/products', icon: <FaBoxes /> },
    { label: 'Users', path: '/users', icon: <FaUsers /> },
    { label: 'Settings', path: '/settings', icon: <FaCogs /> },
  ];

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="brand">
          <img
            src="/logo.png"
            alt=""
            style={{ height: 32, marginRight: 8, verticalAlign: 'middle' }}
          />
          <span>Heritage Furnishings</span>
        </div>
        <div className="sidebar-user">{user?.email}</div>
        <ul className="sidebar-menu">
          {menuItems.map((item, idx) =>
            item.divider ? (
              <hr key={idx} />
            ) : (
              <li
                key={idx}
                onClick={() => navigate(item.path)}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.icon}
                <span style={{ marginLeft: 8 }}>{item.label}</span>
              </li>
            )
          )}
          <hr />
          <li onClick={() => { logout(); navigate('/login'); }} className="logout-link">
            <FaSignOutAlt style={{ marginRight: '8px' }} />
            Logout
          </li>
        </ul>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
};

export default AdminLayout;

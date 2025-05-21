import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaClipboardList, FaTruckLoading, FaUndoAlt,
  FaWarehouse, FaBoxOpen, FaBoxes, FaSignOutAlt
} from 'react-icons/fa';
import '../styles/Management.css';

const StockManagerLayout = ({ children }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/stock/dashboard', icon: <FaClipboardList /> },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: <FaClipboardList /> },
    { label: 'Receiving', path: '/receiving', icon: <FaTruckLoading /> },
    { label: 'Return List', path: '/returns', icon: <FaUndoAlt /> },
    { label: 'Stocks', path: '/stocks', icon: <FaWarehouse /> },
    { label: 'Items', path: '/products', icon: <FaBoxes /> },
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
        <div className="sidebar-user">{user?.email || 'Stock Manager'}</div>
        <ul className="sidebar-menu">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => navigate(item.path)}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.icon}
              <span style={{ marginLeft: 8 }}>{item.label}</span>
            </li>
          ))}
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

export default StockManagerLayout;
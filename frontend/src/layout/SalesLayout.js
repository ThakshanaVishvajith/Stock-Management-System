import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaClipboardList, FaTruckLoading, FaExchangeAlt, FaUndoAlt,
  FaWarehouse, FaDollarSign, FaBoxOpen, FaBoxes, FaUsers, FaCogs, FaSignOutAlt
} from 'react-icons/fa';
import '../styles/Management.css';

const SalesLayout = ({ children }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

const menuItems = [
    {
        label: 'Dashboard',
        icon: <FaDollarSign style={{ marginRight: 8 }} />,
        path: '/sales/dashboard',
        active: location.pathname === '/sales/dashboard',
    },
    {
        label: 'Sales Orders',
        icon: <FaClipboardList style={{ marginRight: 8 }} />,
        path: '/sales-orders',
        active: location.pathname.startsWith('/sales-orders'),
    },

    {
        label: 'Customers',
        icon: <FaClipboardList style={{ marginRight: 8 }} />,
        path: '/customers',
        active: location.pathname.startsWith('/customers'),
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
                {menuItems.map((item, idx) => (
                    <li
                        key={idx}
                        className={item.active ? 'active' : ''}
                        onClick={() => navigate(item.path)}
                        style={{ cursor: 'pointer' }}
                    >
                        {item.icon}
                        {item.label}
                    </li>
                ))}
                <hr />
                <li onClick={handleLogout} className="logout-link" style={{ cursor: 'pointer' }}>
                    <FaSignOutAlt style={{ marginRight: 8 }} />
                    Logout
                </li>
            </ul>
        </aside>
        <main className="dashboard-main">
            {children}
        </main>
    </div>
  );
};

export default SalesLayout; 


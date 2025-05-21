import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StockManagerLayout from '../layout/StockManagerLayout';
import {
  FaClipboardList, FaTruckLoading, FaUndoAlt,
  FaWarehouse, FaBoxes, FaBoxOpen, FaExclamationTriangle
} from 'react-icons/fa';

const LOW_STOCK_THRESHOLD = 5;

const StockDashboard = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats (optional, you can expand this as needed)
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stock', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        setStats({});
      }
    };

    // Fetch products for low stock
    const fetchLowStock = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lowStock = res.data.filter(p => p.stock !== undefined && p.stock <= LOW_STOCK_THRESHOLD);
        setLowStockItems(lowStock);
      } catch (err) {
        setLowStockItems([]);
      }
    };

    fetchStats();
    fetchLowStock();
  }, [token]);

  const widgets = [
    { label: 'Purchase Orders', count: stats.totalPurchaseOrders, icon: <FaClipboardList />, color: 'teal' },
    { label: 'Receiving Records', count: stats.totalReceiving, icon: <FaTruckLoading />, color: 'orange' },
    { label: 'Return Records', count: stats.totalReturns, icon: <FaUndoAlt />, color: 'red' },
    { label: 'Stocks', count: stats.totalStock, icon: <FaWarehouse />, color: 'purple' },
    { label: 'Items', count: stats.totalProducts, icon: <FaBoxes />, color: 'steelblue' },
    { label: 'Suppliers', count: stats.totalSuppliers, icon: <FaBoxOpen />, color: 'darkblue' },
  ];

  return (
    <StockManagerLayout>
      <div className="admin-container">
        <main className="dashboard-main">
          <h1>Stock Manager Dashboard</h1>
          <div className="dashboard-cards">
            {widgets.map((w, i) => (
              <div key={i} className="card" style={{ borderLeft: `5px solid ${w.color}` }}>
                <div className="card-icon">{w.icon}</div>
                <div className="card-content">
                  <h3>{w.label}</h3>
                  <p>{w.count !== undefined ? w.count : '-'}</p>
                </div>
              </div>
            ))}
            {/* Low Stock Card */}
            <div className="card" style={{ borderLeft: '5px solid crimson', minWidth: 260 }}>
              <div className="card-icon"><FaExclamationTriangle color="crimson" /></div>
              <div className="card-content">
                <h3>Low Stock Items</h3>
                <p>{lowStockItems.length}</p>
                {lowStockItems.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
                    {lowStockItems.slice(0, 5).map(item => (
                      <li key={item._id}>
                        {item.name} (Stock: {item.stock})
                      </li>
                    ))}
                    {lowStockItems.length > 5 && <li>...and more</li>}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </StockManagerLayout>
  );
};

export default StockDashboard;
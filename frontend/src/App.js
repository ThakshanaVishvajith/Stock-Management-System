import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import StockDashboard from './pages/StockDashboard';
import SalesDashboard from './pages/SalesDashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import Receiving from './pages/Receiving';
import Stock from './pages/Stock';
import Customer from './pages/Customer';
import SalesOrder from './pages/SalesOrder';
import SalesList from './pages/SalesList';
import AdminLayout from './layout/AdminLayout';
import StockManagerLayout from './layout/StockManagerLayout';
import Settings from './pages/Settings';

 // ✅ import at the top


// Placeholder components (create these pages accordingly)

const Reports = () => <div>Reports Page</div>;
const ReturnList = () => <div>Return List Page</div>;

// Layout placeholders (replace with your actual layouts if available)




function AppRoutes() {
  const { token, role, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin-only routes */}
      {token && role === 'admin' && (
        <>
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/purchase-orders" element={<AdminLayout><PurchaseOrders /></AdminLayout>} />
          <Route path="/receiving" element={<AdminLayout><Receiving /></AdminLayout>} />
          <Route path="/reports" element={<AdminLayout><Reports /></AdminLayout>} />
          <Route path="/return-list" element={<AdminLayout><ReturnList /></AdminLayout>} />
          <Route path="/stocks" element={<AdminLayout><Stock /></AdminLayout>} />
          <Route path="/sales-list" element={<SalesList />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/products" element={<AdminLayout><Products /></AdminLayout>} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
        </>
      )}

      {/* Stock Manager-only routes */}
      {token && role === 'stock_manager' && (
        <>
         <Route path="/stock/dashboard" element={<StockDashboard />} />
          <Route path="/purchase-orders" element={<StockManagerLayout><PurchaseOrders /></StockManagerLayout>} />
          <Route path="/receiving" element={<StockManagerLayout><Receiving /></StockManagerLayout>} />
          <Route path="/returns" element={<StockManagerLayout><ReturnList /></StockManagerLayout>} />
          <Route path="/stocks" element={<StockManagerLayout><Stock /></StockManagerLayout>} />
          <Route path="/products" element={<StockManagerLayout><Products /></StockManagerLayout>} />
        </>
      )}

      {/* Sales Rep-only routes */}
      {token && role === 'sales_rep' && (
        <>
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/sales-orders" element={<SalesOrder />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

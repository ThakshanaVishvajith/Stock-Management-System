import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Management.css';


const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
  
      // Save token & role in context
      login(res.data.token, res.data.role);
  
      // Redirect based on role
      switch (res.data.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'stock_manager':
          navigate('/stock/dashboard');
          break;
        case 'sales_rep':
          navigate('/sales/dashboard');
          break;
        default:
          navigate('/login'); // fallback
          break;
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Invalid email or password');
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="form-box">
          <h1>Heritage Furnishings</h1>
          <p className="subtitle">Inventory management system</p>
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="options">
              <label>
                <input type="checkbox" /> Keep me logged in
              </label>
            </div>
            <button className="login-btn" type="submit">Log in</button>
          </form>

          <div className="signup-section">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
            
          </div>
        </div>
        <div className="image-box">
          <img src="/login-image.jpg" alt="POS Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;

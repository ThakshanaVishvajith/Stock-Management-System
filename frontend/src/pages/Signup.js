import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Management.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales_rep', // default valid role
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      console.log('Registered successfully:', res.data);
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err.response?.data?.error || err.message);
      setError('Signup failed. Try a different email.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="form-box">
          <h1>E-Inventory</h1>
          <p className="subtitle">Create your account</p>
          <form onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="sales_rep">Sales Representative</option>
              <option value="stock_manager">Stock Manager</option>
            </select>

            <button className="login-btn" type="submit">Sign Up</button>
          </form>

          <div className="signup-section">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
        <div className="image-box">
          <img src="/illustration.png" alt="Signup Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/company', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) setForm(res.data);
      } catch (err) {
        setMessage('Failed to load company details');
      }
    };
    fetchCompany();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/company', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Company details updated!');
    } catch (err) {
      setMessage('❌ Failed to update company details');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '80vh',
      background: '#f7f8fa'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px #e0e0e0',
        padding: '32px 40px',
        marginTop: 48,
        minWidth: 350,
        maxWidth: 420
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <h2 style={{ margin: 0, fontWeight: 700, color: '#222' }}>Company Settings</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 500, color: '#444' }}>Company Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                marginTop: 6,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 15
              }}
              placeholder="Enter company name"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 500, color: '#444' }}>Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                marginTop: 6,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 15
              }}
              placeholder="Enter phone number"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 500, color: '#444' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                marginTop: 6,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 15
              }}
              placeholder="Enter email address"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 500, color: '#444' }}>Address</label>
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                marginTop: 6,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 15,
                minHeight: 60,
                resize: 'vertical'
              }}
              placeholder="Enter company address"
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 0',
              background: '#2e7dff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e0e0e0'
            }}
          >
            Update Company Details
          </button>
        </form>
        {message && (
          <div style={{
            marginTop: 20,
            color: message.startsWith('✅') ? 'green' : 'crimson',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
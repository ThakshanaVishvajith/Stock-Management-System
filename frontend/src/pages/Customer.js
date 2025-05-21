import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import  SalesLayout from '../layout/SalesLayout';
import { AuthContext } from '../context/AuthContext';
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/Management.css';

const CustomerPage = () => {
  const { token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    customertype: '',
    email: '',
    deliveryaddress: '',
    currency: '',
    bankaccount: '',
    bankname: '',
    paymentterms: '',
    _id: null
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get('http://localhost:5000/api/customers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCustomers(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/customers', form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    clearForm();
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/customers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCustomers();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/customers/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    clearForm();
    fetchCustomers();
  };

  const clearForm = () => {
    setForm({
      name: '',
      phone: '',
      address: '',
      customertype: '',
      email: '',
      deliveryaddress: '',
      currency: '',
      bankaccount: '',
      bankname: '',
      paymentterms: '',
      _id: null
    });
  };

  return (
    <SalesLayout>
      <div className="customers-page">
        <h2>Customers</h2>
        <div className="po-section-card">


          <form className="add-customer-form" onSubmit={handleAdd}>
          <input type="text" placeholder="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input type="text" placeholder="Phone" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input type="text" placeholder="Address" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
          <input type="text" placeholder="Customer Type" value={form.customertype || ''} onChange={e => setForm({ ...form, customertype: e.target.value })} />
          <input type="email" placeholder="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="text" placeholder="Delivery Address" value={form.deliveryaddress || ''} onChange={e => setForm({ ...form, deliveryaddress: e.target.value })} />
          <input type="text" placeholder="Currency" value={form.currency || ''} onChange={e => setForm({ ...form, currency: e.target.value })} />
          <input type="text" placeholder="Bank Account" value={form.bankaccount || ''} onChange={e => setForm({ ...form, bankaccount: e.target.value })} />
          <input type="text" placeholder="Bank Name" value={form.bankname || ''} onChange={e => setForm({ ...form, bankname: e.target.value })} />
          <input type="text" placeholder="Payment Terms" value={form.paymentterms || ''} onChange={e => setForm({ ...form, paymentterms: e.target.value })} />
          <button type="submit">Add Customer</button>
        </form>
        </div>
        
         <div className="po-section-card">

         </div>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Customer Type</th>
              <th>Email</th>
              <th>Delivery Address</th>
              <th>Currency</th>
              <th>Bank Account</th>
              <th>Bank Name</th>
              <th>Payment Terms</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{form._id === c._id ? <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /> : c.name}</td>
                <td>{form._id === c._id ? <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /> : c.phone}</td>
                <td>{form._id === c._id ? <input value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} /> : c.address}</td>
                <td>{form._id === c._id ? <input value={form.customertype || ''} onChange={e => setForm({ ...form, customertype: e.target.value })} /> : c.customertype}</td>
                <td>{form._id === c._id ? <input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /> : c.email}</td>
                <td>{form._id === c._id ? <input value={form.deliveryaddress || ''} onChange={e => setForm({ ...form, deliveryaddress: e.target.value })} /> : c.deliveryaddress}</td>
                <td>{form._id === c._id ? <input value={form.currency || ''} onChange={e => setForm({ ...form, currency: e.target.value })} /> : c.currency}</td>
                <td>{form._id === c._id ? <input value={form.bankaccount || ''} onChange={e => setForm({ ...form, bankaccount: e.target.value })} /> : c.bankaccount}</td>
                <td>{form._id === c._id ? <input value={form.bankname || ''} onChange={e => setForm({ ...form, bankname: e.target.value })} /> : c.bankname}</td>
                <td>{form._id === c._id ? <input value={form.paymentterms || ''} onChange={e => setForm({ ...form, paymentterms: e.target.value })} /> : c.paymentterms}</td>
                <td>
                  {form._id === c._id ? (
                    <>
                      <button className="save-btn" onClick={() => handleUpdate(c._id)}><FaSave /></button>
                      <button className="cancel-btn" onClick={clearForm}><FaTimes /></button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => setForm({ ...c })}><FaEdit /></button>
                      <button className="delete-btn" onClick={() => handleDelete(c._id)}><FaTrashAlt /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SalesLayout>
  );
};

export default CustomerPage;
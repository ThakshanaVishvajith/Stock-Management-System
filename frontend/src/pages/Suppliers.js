import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import { AuthContext } from '../context/AuthContext';
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/Management.css';

const SuppliersPage = () => {
  const { token } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    scode: '',  
    scurrency: '',
    sbankname: '',
    sbankaccount: '',
    spaymentdescription: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    _id: null
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await axios.get('http://localhost:5000/api/suppliers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuppliers(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
  
    const newSupplier = {
      name: form.name,
      
      scurrency: form.scurrency,
      sbankname: form.sbankname,
      sbankaccount: form.sbankaccount,
      spaymentdescription: form.spaymentdescription,
      company: form.company,
      email: form.email,
      phone: form.phone,
      address: form.address
    };
  
    await axios.post('http://localhost:5000/api/suppliers', newSupplier, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    clearForm();
    fetchSuppliers();
  };
  

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/suppliers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSuppliers();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/suppliers/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    clearForm();
    fetchSuppliers();
  };

  const clearForm = () => {
    setForm({
      name: '',
    
      scurrency: '',
      sbankname: '',
      sbankaccount: '',
      spaymentdescription: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      _id: null
    });
  };

  return (
    <AdminLayout>
      <div className="suppliers-page">
        <h2>Suppliers </h2>

        <form className="add-supplier-form" onSubmit={handleAdd}>
          <input type="text" placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          
          <input type="text" placeholder="Supplier Currency" value={form.scurrency || ''} onChange={(e) => setForm({ ...form, scurrency: e.target.value })} required />
          <input type="text" placeholder="Supplier Bank Name" value={form.sbankname || ''} onChange={(e) => setForm({ ...form, sbankname: e.target.value })} required />
          <input type="text" placeholder="Supplier Bank Account" value={form.sbankaccount || ''} onChange={(e) => setForm({ ...form, sbankaccount: e.target.value })} required />
          <input type="text" placeholder="Supplier Payment Description" value={form.spaymentdescription || ''} onChange={(e) => setForm({ ...form, spaymentdescription: e.target.value })} required />
          <input type="text" placeholder="Company" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input type="email" placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="text" placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="text" placeholder="Address" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button type="submit">Add Supplier</button>
        </form>

        <table className="supplier-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Supplier Code</th>  
              <th>Supplier Currency</th>
              <th>Supplier Bank Name</th>
              <th>Supplier Bank Account</th>
              <th>Supplier Payment Description</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s._id}>
                <td>{form._id === s._id ? <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /> : s.name}</td>
                <td>  {s.scode}</td>
                <td>{form._id === s._id ? <input value={form.scurrency || ''} onChange={(e) => setForm({ ...form, scurrency: e.target.value })} /> : s.scurrency}</td>
                <td>{form._id === s._id ? <input value={form.sbankname || ''} onChange={(e) => setForm({ ...form, sbankname: e.target.value })} /> : s.sbankname}</td>
                <td>{form._id === s._id ? <input value={form.sbankaccount || ''} onChange={(e) => setForm({ ...form, sbankaccount: e.target.value })} /> : s.sbankaccount}</td>
                <td>{form._id === s._id ? <input value={form.spaymentdescription || ''} onChange={(e) => setForm({ ...form, spaymentdescription: e.target.value })} /> : s.spaymentdescription}</td>
                <td>{form._id === s._id ? <input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} /> : s.company}</td>
                <td>{form._id === s._id ? <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /> : s.email}</td>
                <td>{form._id === s._id ? <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /> : s.phone}</td>
                <td>{form._id === s._id ? <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /> : s.address}</td>
                <td>
                  {form._id === s._id ? (
                    <>
                      <button className="save-btn" onClick={() => handleUpdate(s._id)}><FaSave /></button>
                      <button className="cancel-btn" onClick={clearForm}><FaTimes /></button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => setForm({ ...s })}><FaEdit /></button>
                      <button className="delete-btn" onClick={() => handleDelete(s._id)}><FaTrashAlt /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default SuppliersPage;

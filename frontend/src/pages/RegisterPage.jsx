// src/pages/RegisterPage.jsx

import Header from '../components/common/Header';
import React, { useState } from 'react';
import './pages.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '' // ✅ added role
  });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('Registering:', formData);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registered successfully!');
        navigate('/');
      } else {
        alert(data.message || 'Registration failed.');
      }

    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering user.');
    }
  };

  return (
    <div>
      <Header />
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder='Enter email' title="Please enter a valid email address" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          
          <label htmlFor="role">Register As:</label>
          <select name="role" id='role' value={formData.role} onChange={handleChange} required >
            <option value="" >Select role</option>
            <option value="employer">Employer</option>
            <option value="applicant">Applicant</option>
          </select>

          <button type="submit">Register</button>
          <p>Already have an account? <a href="/login">Login here</a></p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

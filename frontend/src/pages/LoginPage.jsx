// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import './pages.css';

const LoginPage = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store JWT token
        localStorage.setItem('token', data.token);

        // ✅ Store email
        localStorage.setItem('userEmail', formData.email);

        // ✅ Store user role (important for conditional rendering)
        if (data.user.role) {
          localStorage.setItem('userRole', data.user.role);
          console.log('User role:', data.user.role); // Debug check
        } else {
          console.warn('User role not found in response');
        }

         // ✅ Redirect to Employee Dashboard (or wherever you want)
        if (data.user.role === 'employer') {
          navigate('/Employee-Dashboard');
        } else if (data.user.role === 'applicant') {
          navigate('/');
        }

      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}required />
          
          <button type="submit">Login</button>
          <p>New User? <a href="/register">Create Account</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

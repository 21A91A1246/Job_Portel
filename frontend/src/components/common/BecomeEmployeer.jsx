// src/pages/BecomeEmployer.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BecomeEmployer = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleBecomeEmployer = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in.');
        return navigate('/login');
      }

      const res = await fetch(`${import.meta.env.REACT_APP_API_BASE_URL}/api/users/update-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // ✅ This is the correct format
        },
        body: JSON.stringify({ newRole: 'employer' })
      });

      const data = await res.json();

      if (res.ok) {
        alert('🎉 You are now registered as an employer!');
        localStorage.setItem('userRole', 'employer');
        navigate('/Employee-Dashboard');
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {userRole !== 'employer' && (
        <button onClick={handleBecomeEmployer} disabled={loading}>
          {loading ? 'Updating...' : 'Become an Employer'}
        </button>
      )}
    </>
  );
};

export default BecomeEmployer;

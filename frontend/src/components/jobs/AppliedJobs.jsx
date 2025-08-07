import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckSquare } from 'react-icons/fa';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view applied jobs');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-applied`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppliedJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch applied jobs:', err);
        setAppliedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) return <p>Loading applied jobs...</p>;

  return (
    <div>
      <h2>Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <p>You haven't applied to any jobs.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {appliedJobs.map((job) => (
            <li
              key={job._id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#e9fbe9',
                borderRadius: '8px',
              }}
            >
              <h3 style={{ color: 'orangered', marginBottom: '5px' }}>{job.jobRole}</h3>
              <p><strong>Company:</strong> {job.companyName}</p>
              <p><strong>Type:</strong> {job.employmentType}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p style={{ fontWeight: 'bold', color: '#444' }}>
                <FaCheckSquare color="green" /> Applied
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppliedJobs;

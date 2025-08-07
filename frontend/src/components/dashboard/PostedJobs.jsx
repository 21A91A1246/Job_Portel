import React from 'react'
import './dashboard.css';
import { useState,useEffect } from 'react';
import Header from '../common/Header';

const PostedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employer/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        

        if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');

        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (err) {
        console.error(err);
        alert('Error fetching jobs.');
      }
    };

    if (token) fetchJobs();
  }, [token]);

  const fetchApplicants = async (jobId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/employer/applicants/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch applicants');
      setApplicants(data.applicants || []);
    } catch (err) {
      console.error(err);
      alert('Error fetching applicants.');
    }
  };
  return (
    <div>
        <Header/>
      <center>
          <h2 style={{ color: 'orangered', marginTop:'10px'}}>Your Posted Jobs</h2>
        </center>
        {jobs.length === 0 ? (
          <p>You haven't posted any jobs yet.</p>
        ) : (
          <div
            style={{
              gap: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ul>
              {jobs.map((job) => (
                <li key={job._id} style={{ marginBlock: '10px', marginLeft: '20px' }}>
                  <b>{job.jobRole}</b> — {job.location}{' '}
                  <button onClick={() => { setSelectedJob(job); fetchApplicants(job._id); }}> See Applicants </button>
                  {/* start */}
                    {selectedJob?._id === job._id && (
                        <div>
                          <h3 style={{ color: 'orangered' }}>Applicants for: {job.jobRole}</h3>
                          {applicants.length === 0 ? (
                            <p>No applications yet.</p>
                          ) : (
                            <ul>
                              {applicants.map((app) => (
                                <li key={app._id} style={{ marginLeft: '20px' }}>
                                  <p><b>{app.applicantName}</b> — {app.applicantEmail}</p>
                                  {app.resumePath && (
                                    <a
                                      href={`http://localhost:5000/${app.resumePath}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Download Resume
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                  )}
                  {/* end */}
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  )
}

export default PostedJobs

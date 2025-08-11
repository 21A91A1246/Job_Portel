// src/pages/applicant/RecentActivity.jsx
import React, { useState, useEffect } from 'react';
import './ApplicantDashboard.css';

const RecentActivity = ({ appliedJobs }) => {
  const [showAll, setShowAll] = useState(false);
  const [applications, setApplications] = useState([]);

  // Sync state when appliedJobs prop changes
  useEffect(() => {
    if (appliedJobs && Array.isArray(appliedJobs)) {
      setApplications(appliedJobs);
    }
  }, [appliedJobs]);

  // Delete handler (UI-only)
  const handleDelete = (jobId) => {
    if (!window.confirm('Are you sure you want to remove this from view?')) return;

    setApplications((prev) =>
      prev.filter((job) => job._id !== jobId && job.jobId !== jobId)
    );
  };

  // Map and sort by appliedAt or fallback to createdAt
  const allApps = applications
    .map((job) => ({
      title: job.jobRole,
      company: job.companyName,
      location: job.location,
      date: new Date(job.appliedAt || job.createdAt).toLocaleDateString(),
      timestamp: new Date(job.appliedAt || job.createdAt),
      status: 'Applied',
      applicantName: job.applicantName,
      mobileNumber: job.mobileNumber,
      resumeFilename: job.resume?.filename,
      jobId: job._id || job.jobId,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

  const displayedApps = showAll ? allApps : allApps.slice(0, 5);

  return (
    <div className="section">
      <h2>Recent Applications</h2>
      <div className="applications">
        {displayedApps.length === 0 ? (
          <p>No recent applications found.</p>
        ) : (
          displayedApps.map((job, i) => (
            <div key={i} className="app-card">
              <div className="job-info">
                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <p>{job.location} • Applied {job.date}</p>
                <p><strong>Name:</strong> {job.applicantName || 'N/A'}</p>
                <p><strong>Phone:</strong> {job.mobileNumber || 'N/A'}</p>
                <p>
                  <strong>Resume:</strong>{' '}
                  {job.resumeFilename ? (
                    <a
                      href={`/api/resume/${job.jobId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {job.resumeFilename}
                    </a>
                  ) : (
                    'No Resume'
                  )}
                </p>
              </div>

              <div className="job-actions">
                <span
                  className={`badge badge-${job.status
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {job.status}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(job.jobId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {allApps.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            className="view-all-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'View Less' : 'View All'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;

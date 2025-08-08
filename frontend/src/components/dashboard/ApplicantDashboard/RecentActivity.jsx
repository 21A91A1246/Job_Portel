// src/pages/applicant/RecentActivity.jsx
import React, { useState } from 'react';
import './ApplicantDashboard.css';

const RecentActivity = ({ appliedJobs }) => {
  const [showAll, setShowAll] = useState(false);

  // Map and sort by appliedAt or fallback to createdAt
  const allApps = appliedJobs
    .map((job) => ({
      title: job.jobRole,
      company: job.companyName,
      location: job.location,
      date: new Date(job.appliedAt || job.createdAt).toLocaleDateString(),
      timestamp: new Date(job.appliedAt || job.createdAt),
      status: 'Applied',

      // Add applicant fields here if coming from backend:
      applicantName: job.applicantName,
      mobileNumber: job.mobileNumber,
      resumeFilename: job.resume?.filename,
      jobId: job._id || job.jobId, // to construct resume URL
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

  // If not showing all, only take first 5
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

                {/* Applicant details */}
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
              <div
                className={`badge badge-${job.status
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
              >
                {job.status}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toggle Button */}
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

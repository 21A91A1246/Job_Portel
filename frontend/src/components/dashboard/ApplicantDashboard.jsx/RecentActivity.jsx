// src/pages/applicant/RecentActivity.jsx
import React from 'react';
import './ApplicantDashboard.css';

const RecentActivity = ({ appliedJobs }) => {
  // Map and sort by appliedAt or fallback to createdAt
  const recentApps = appliedJobs
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
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5); // Show only 5 recent applications

  return (
    <div className="section">
      <h2>Recent Applications</h2>
      <div className="applications">
        {recentApps.length === 0 ? (
          <p>No recent applications found.</p>
        ) : (
          recentApps.map((job, i) => (
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
                    <a href={`/api/resume/${job.jobId}`} target="_blank" rel="noopener noreferrer">
                      {job.resumeFilename}
                    </a>
                  ) : (
                    'No Resume'
                  )}
                </p>
              </div>
              <div className={`badge badge-${job.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {job.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;

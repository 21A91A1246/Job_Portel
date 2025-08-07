// ✅ JobsPage.jsx
import React from 'react';
import './pages.css';

const JobsPage = ({ jobs = [], onJobClick = () => {}, appliedJobIds = [] }) => {
  return (
    <div className="jobs-container">
      <h2 style={{marginBottom:'10px'}}>Available Jobs</h2>

      {jobs.length === 0 && <p>No jobs found.</p>}

      {jobs.map((job, index) => {
        const jobKey = job._id || job.externalId || index;

        const isApplied =
          Array.isArray(appliedJobIds) &&
          (appliedJobIds.includes(String(job._id)) || appliedJobIds.includes(String(job.externalId)));


        return (
          <div
            key={jobKey}
            className={`job-card ${isApplied ? 'applied' : ''}`}
            onClick={() => !isApplied && onJobClick(job)}
            style={{ pointerEvents: isApplied ? 'none' : 'auto' }}
          >
            <h3>{job.jobRole || job.title || 'Untitled Job'}</h3>
            <p><strong>Company:</strong> {job.companyName || job.company || 'Unknown'}</p>
            <p><strong>Type:</strong> {job.employmentType || 'Full Time'}</p>
            <p><strong>Location:</strong> {job.location || 'Unspecified'}</p>
            <p className={`status ${isApplied ? 'status-applied' : 'status-apply'}`}>
              {isApplied ? '✅ Applied' : 'Click to View & Apply'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default JobsPage;

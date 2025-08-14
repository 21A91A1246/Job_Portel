import React from 'react';
import './pages.css';

const JobsPage = ({
  jobs = [],
  onJobClick = () => {},
  appliedJobIds = [],
  onShowMore,
  loading,
  hasMore,
}) => {
  return (
    <div className="jobs-container">
      <h2 style={{ marginBottom: '10px' }}>Available Jobs</h2>

      {jobs.length === 0 && !loading && <p>No jobs found.</p>}

      {jobs.map((job, index) => {
        // Use composite key to ensure uniqueness
        const jobKey = `${job._id || job.externalId || 'job'}-${index}`;

        const isApplied =
          Array.isArray(appliedJobIds) &&
          (appliedJobIds.includes(String(job._id)) ||
            appliedJobIds.includes(String(job.externalId)));

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

      {/* {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            className="show-more-btn"
            onClick={onShowMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Show More Jobs'}
          </button>
        </div>
      )} */}
    </div>
  );
};

export default JobsPage;

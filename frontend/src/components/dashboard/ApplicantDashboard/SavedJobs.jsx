import React from 'react';
import './ApplicantDashboard.css';

const savedJobs = [
  { title: 'Senior React Developer', company: 'Stripe', location: 'San Francisco, CA', saved: '2 days ago' },
  { title: 'Frontend Engineer', company: 'Airbnb', location: 'Remote', saved: '1 week ago' },
  { title: 'UI/UX Developer', company: 'Spotify', location: 'New York, NY', saved: '2 weeks ago' }
];

const SavedJobs = () => {
  return (
    <div className="section">
      <center><h2>Saved Jobs</h2></center>
      <div className="saved-jobs">
        {savedJobs.map((job, i) => (
          <div key={i} className="saved-job-card">
            <div>
              <h4>{job.title}</h4>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <p className="saved-date">Saved {job.saved}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;

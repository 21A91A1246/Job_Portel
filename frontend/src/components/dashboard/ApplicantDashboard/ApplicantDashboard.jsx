// src/pages/applicant/ApplicantDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import './ApplicantDashboard.css';
import Header from '../../common/Header';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import JobRecommendations from './JobRecommendations';
import SavedJobs from './SavedJobs';
import ApplyJobs from '../../jobs/ApplyJobs';
import JobsPage from '../../../pages/JobsPage';

const ApplicantDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showApplied, setShowApplied] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const email = localStorage.getItem('userEmail');

  const formatJob = (job, index) => ({
    _id: job._id || job.id || index.toString(),
    externalId: job.id,
    jobRole: job.jobRole || job.title || 'Untitled',
    companyName: job.companyName || job.company?.display_name || job.company || 'Unknown',
    experience: job.experience || 'Not specified',
    skills: job.skills || ['JavaScript', 'React'],
    location: job.location?.display_name || job.location || 'Location not available',
    salary: job.salary_min
      ? `${job.salary_min} - ${job.salary_max}`
      : job.salary || 'Not specified',
    postedDate: job.postedDate || job.created || new Date(),
    employmentType: job.employmentType || job.contract_time || 'Full Time',
    jobDescription: job.jobDescription || job.description || 'No description provided',
    redirectUrl: job.redirect_url || job.redirectUrl || '',
    createdAt: new Date(),
    appliedAt: job.appliedAt ? new Date(job.appliedAt) : null, // Optional
  });

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/adzuna?what=software+developer&where=India`);
      const data = await response.json();
      const formattedJobs = data.map(formatJob);
      setJobs(formattedJobs);
      setSelectedJob(formattedJobs[0]);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  }, []);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user-applied`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();

      // ✅ make sure data is an array
      if (Array.isArray(data)) {
        setAppliedJobs(data);
      } else {
        setAppliedJobs([]); // fallback if the API gives something unexpected
      }
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setAppliedJobs([]); // fallback on error too
    }
  }, []);


  const handleApply = async (formData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        fetchAppliedJobs(); // Refresh applied jobs list
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('An error occurred while submitting your application.');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, [fetchJobs,fetchAppliedJobs]);

  const appliedJobIds = appliedJobs.map(app => String(app.jobId)); // ← Correct
  const filteredJobs = showApplied ? jobs.filter(job => appliedJobIds.includes(job._id)) : jobs;
  const visibleJobs = filteredJobs.slice(0, visibleCount);

  return (
    <div className="dashboard">
      <Header />
      <h1>Welcome back, <span style={{ fontSize: '25px' }}>{email}!</span></h1>
      <p>Here's what's happening with your job search</p>

      <DashboardStats totalApplications={appliedJobs.length} />

      <div className="bottomDiv">
        <div className="leftDiv">
          <button onClick={() => setShowApplied(!showApplied)}>
            {showApplied ? 'Show All Jobs' : 'Show Applied Jobs'}
          </button>

          <JobsPage jobs={visibleJobs} onJobClick={setSelectedJob} appliedJobIds={appliedJobIds} />

          {visibleCount < filteredJobs.length && (
            <button className="show-more-btn" onClick={() => setVisibleCount(prev => prev + 10)}>
              Show More
            </button>
          )}
        </div>

        <div className="rightDiv">
          <ApplyJobs selectedJob={selectedJob} handleApply={handleApply} isLoggedIn={true} />
        </div>
      </div>

      <RecentActivity appliedJobs={appliedJobs} />
      <JobRecommendations />
      <SavedJobs />
    </div>
  );
};

export default ApplicantDashboard;

import React, { useEffect, useState, useCallback } from 'react';
import './pages.css';
import { suggestSkillsForJob } from '../utils/extractSkills';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBox';
import JobsPage from './JobsPage';
import CTASection from '../components/common/CTASection';
import Footer from '../components/common/Footer';
import ApplyJobs from '../components/jobs/ApplyJobs';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const formatJob = (job, index) => {
    const extractedSkills = suggestSkillsForJob(job);

    return {
      _id: job._id || index.toString(),
      externalId: job.id || job.externalId,
      jobRole: job.title || job.jobRole || 'Untitled',
      companyName: job.company?.display_name || job.companyName || 'Unknown Company',
      experience: job.experience || 'Not specified',
      skills: extractedSkills.length ? extractedSkills : ['Not specified'],
      location: job.location?.display_name || job.location || 'Unspecified Location',
      salary: job.salary_min
        ? `₹${job.salary_min} - ₹${job.salary_max}`
        : job.salary || 'Not specified',
      postedDate: job.created ? new Date(job.created) : new Date(),
      employmentType: job.contract_type || job.employmentType || 'Full Time',
      jobDescription: job.description || job.jobDescription || 'No description available',
      redirectUrl: job.redirect_url || job.redirectUrl || '',
      createdAt: new Date(),
    };
  };

  const fetchJobs = useCallback(async () => {
    try {
      setErrorMessage(null);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/adzuna?what=software+developer&where=India&results_per_page=10`);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        throw new Error(`Unexpected response: ${errorText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }

      const formatted = data.map(formatJob);
      setJobs(formatted);
    } catch (err) {
      setErrorMessage(err.message || 'Error fetching jobs');
      setJobs([]);
      console.error('Error fetching jobs:', err);
    }
  }, []);

  const fetchAppliedJobs = useCallback(async () => {
    try {
      setErrorMessage(null);
      if (!token) {
        console.warn('No token found in localStorage');
        setAppliedJobIds([]);
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user-applied`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch applied jobs');
      }

      const ids = await res.json();
      setAppliedJobIds(ids);
    } catch (err) {
      setErrorMessage(err.message || 'Error fetching applied jobs');
      setAppliedJobIds([]);
      console.error('Error fetching applied jobs:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, [fetchJobs, fetchAppliedJobs]);

  const handleSearch = async (searchText = '', locationText = '') => {
    if (!searchText && !locationText) {
      alert('Please enter a job title or location.');
      return;
    }
    try {
      setErrorMessage(null);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/adzuna?what=${encodeURIComponent(searchText)}&where=${encodeURIComponent(locationText)}`
      );

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        throw new Error(`Unexpected response: ${errorText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }

      const formattedJobs = data.map(formatJob);
      setJobs(formattedJobs);
      setSelectedJob(null);
    } catch (err) {
      setErrorMessage(err.message || 'Error searching jobs');
      setJobs([]);
      setSelectedJob(null);
      console.error('Error searching jobs:', err);
    }
  };

  const handleApply = async (formData) => {
    try {
      if (!token) {
        alert('You must be logged in to apply for a job.');
        return;
      }
      setErrorMessage(null);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        fetchAppliedJobs();
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to submit application'));
      }
    } catch (error) {
      setErrorMessage('Error submitting application.');
      console.error(error);
      alert('Error submitting application.');
    }
  };

  return (
    <div className="home">
      <Header />

      <main className="hero">
        <center>
          <SearchBar onSearch={handleSearch} />
        </center>

        <div>
          <center style={{ marginBlock: '50px' }}>
            <h2 style={{ marginBottom: '10px' }}>Featured Companies</h2>
            <p>Join industry leaders and innovative companies that are actively hiring top talent.</p>
          </center>
        </div>

        <div className="bottomDiv">
          <div className="leftDiv">
            {errorMessage && (
              <div style={{ color: 'red', marginBottom: '10px' }}>
                <strong>Error:</strong> {errorMessage}
              </div>
            )}

            <JobsPage
              jobs={jobs}
              onJobClick={setSelectedJob}
              appliedJobIds={appliedJobIds}
            />
          </div>

          <div className="rightDiv">
            <ApplyJobs
              selectedJob={selectedJob}
              handleApply={handleApply}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </main>

      <div className="usersTypes">
        <CTASection />
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;

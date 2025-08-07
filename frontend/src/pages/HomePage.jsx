// ✅ HomePage.jsx
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
  const [showApplied, setShowApplied] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    // console.log("✅ selectedJob:", selectedJob);
  }, [selectedJob]);

    

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
    postedDate: job.created || job.postedDate || new Date(),
    employmentType: job.contract_type || job.employmentType || 'Full Time',
    jobDescription: job.description || job.jobDescription || 'No description available',
    redirectUrl: job.redirect_url || job.redirectUrl || '',
    createdAt: new Date()
  };
};

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/adzuna?what=software+developer&where=India&results_per_page=10');
      const data = await response.json();
      const formatted = data.map(formatJob);
      setJobs(formatted);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user-applied', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const ids = await res.json();
      setAppliedJobIds(ids);
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, [fetchJobs]);

  const handleSearch = async (searchText='', locationText = '') => {
    if (!searchText && !locationText) {
      alert('Please enter a job title or location.');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/adzuna?what=${encodeURIComponent(searchText)}&where=${encodeURIComponent(locationText)}`
      );

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Unexpected response:', errorText);
        throw new Error('Received non-JSON response');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        setJobs([]);
        setSelectedJob(null);  // Clear selected job on invalid data
        return;
      }

      const formattedJobs = data.map(formatJob);
      setJobs(formattedJobs);
      setSelectedJob(null);   // Clear search after new search
    } catch (err) {
      console.error('Error searching jobs:', err);
      setJobs([]);
      setSelectedJob(null);
    }
  };

  const handleApply = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/apply', {
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
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting application.');
    }
  };

  const visibleJobs = showApplied
    ? jobs.filter((job) => appliedJobIds.includes(job._id))
    : jobs;

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
            <button onClick={() => setShowApplied(!showApplied)} style={{display:'none'}}>
              {showApplied ? 'Show All Jobs' : 'Show Applied Jobs'}
            </button>

            <JobsPage
              jobs={visibleJobs}
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

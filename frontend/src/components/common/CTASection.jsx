import React from 'react';
import { FaUserPlus, FaBuilding } from 'react-icons/fa';
import './common.css'; // optional if you want custom styles

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        {/* Job Seekers */}
        <div className="cta-card">
          <div className="cta-icon">
            <FaUserPlus size={40} />
          </div>
          <h2>For Job Seekers</h2>
          <p>
            Create your profile, upload your resume, and get discovered by top employers.
            Start your journey to the perfect career today.
          </p>
          <a className="cta-button" href="/ApplicantDashboard">Create Your Profile</a>
        </div>

        {/* Employers */}
        <div className="cta-card">
          <div className="cta-icon">
            <FaBuilding size={40} />
          </div>
          <h2>For Employers</h2>
          <p>
            Post jobs, search resumes, and connect with qualified candidates.
            Find the talent your company needs to grow and succeed.
          </p>
          <a className="cta-button" href="/PostJobs">Post Your First Job</a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

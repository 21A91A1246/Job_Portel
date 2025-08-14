import React, { useState } from 'react';
import { suggestSkillsForJob } from '../../utils/extractSkills'; // ✅ Correct path

const ApplyJobs = ({ selectedJob, handleApply, isLoggedIn }) => {
  const [resume, setResume] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedJob || selectedJob._id === '0' || !selectedJob.jobRole) {
    return <p>No job selected or invalid job.</p>;
  }
  const {
    jobRole,
    companyName,
    experience,
    skills,
    location,
    salary,
    postedDate,
    redirectUrl,
    employmentType,
    jobDescription,
    description,
    _id,
  } = selectedJob;
  // console.log("link",redirectUrl);
  // console.log("selectedJob", selectedJob);

  const isInternalJob = Boolean(_id);

  // ✅ Prefer DB skills, fallback to AI-suggested
  const skillList = Array.isArray(skills) && skills.length > 0 ? skills : suggestSkillsForJob(selectedJob);

  // console.log("Job role:", jobRole);
  // console.log("Using skills from DB:", skills);
  // console.log("AI Suggested Skills:", suggestSkillsForJob(selectedJob));


  const formattedDate = postedDate
    ? new Date(postedDate).toLocaleDateString('en-IN')
    : 'Not available';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume || !applicantName || !applicantPhone) {
      alert('Please fill in all fields and upload resume.');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', selectedJob._id);
    formData.append('applicantName', applicantName);
    formData.append('applicantPhone', applicantPhone);
    formData.append('resume', resume);

    setIsSubmitting(true);
    await handleApply(formData);
    e.target.reset();
    setResume(null);
    setApplicantName('');
    setApplicantPhone('');
    setIsSubmitting(false);
  };

  const handleResumeChange = (e) => setResume(e.target.files[0]);

  return (
    <>
      <h2>Job Details: {jobRole || 'Untitled'}</h2>
      <p><strong>Company:</strong> {companyName || 'Unknown Company'}</p>
      <p><strong>Experience:</strong> {experience || 'Not specified'}</p>

      <div>
        <strong>Skills:</strong>
        {skillList.length > 0 ? (
          <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skillList.map((skill, index) => (
              <span
                key={index}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p>Not specified</p>
        )}
      </div>

      <p><strong>Location:</strong> {location || 'Unspecified Location'}</p>
      <p><strong>Salary:</strong> {salary ? `₹${salary}` : 'Not specified'}</p>
      <p><strong>Posted Date:</strong> {formattedDate}</p>

      {isInternalJob && isLoggedIn && (
        <form id="job-application-form" onSubmit={handleSubmit}>
          <label htmlFor="applicantName">Name:</label>
          <input
            type="text"
            id="applicantName"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            required
          />

          <label htmlFor="applicantPhone">Phone:</label>
          <input
            type="tel"
            id="applicantPhone"
            value={applicantPhone}
            onChange={(e) => setApplicantPhone(e.target.value)}
            required
          />

          <label htmlFor="resume">Upload Resume:</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            required
          />
          {resume && <p>Selected File: {resume.name}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Apply'}
          </button>
        </form>
      )}
  
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        {redirectUrl ? (
            <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
              <button type="button" >
                View Job Posting
              </button>
            </a>
          ) : (
            <button type="button" disabled>
              No Link Provided
            </button>
          )}

        <button
  type="button"
  onClick={() => {
    localStorage.setItem('selectedJob', JSON.stringify(selectedJob));
    window.open('/ResumeGenerator', '_blank');
  }}
>
  Create Resume
</button>

      </div>

      <div>
        <h2>Other Knowledge, Skills and Abilities:</h2>
        <p><strong>Type:</strong> {employmentType || 'N/A'}</p>
        <p><strong>Job Description:</strong> {jobDescription?.trim() ? jobDescription : (description?.trim() || 'Not provided')}</p>
        <ul>
          <li>Proficient in Microsoft Office Suite and Google Workspace.</li>
          <li>Excellent communication and inter-personal skills</li>
          <li>Customer service focus with agile thinking.</li>
          <li>Excellent verbal and written communication.</li>
          <li>Ability to communicate at all levels of organization.</li>
          <li>Strong problem-solving skills.</li>
          <li>Commitment to high ethical standards and diversity.</li>
        </ul>
      </div>

      <p><strong>WORK ENVIRONMENT:</strong> {location || 'N/A'} (in office).</p>
      <br />
      <p><b>{companyName || 'Company'}</b> reserves the right to change job duties.</p>
      <p><b>{companyName || 'Company'}</b> is an Equal Opportunity Employer.</p>
    </>
  );
};

export default ApplyJobs;

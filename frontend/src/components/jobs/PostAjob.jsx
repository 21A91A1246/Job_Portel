import React, { useState } from 'react';
import './jobs.css';
import Header from '../common/Header';

function PostAjob() {
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [formData, setFormData] = useState({
    CName: '',
    name: '',
    Pnumber: '',
    jobTitle: '',
    experience: '',
    city: '',
    state: '',
    zip: '',
    employmentType: '',
    experienceLevel: '',
    noofpositions: '',
    recruitmentTimeline: '',
    minsalary: '',
    maxsalary: '',
    jobDescription: '',
    communication: '',
    resumeRequired: false,
    skills: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  const benefitsList = [
    'Health insurance',
    'Provident Fund',
    'Paid sick time',
    'Work from home',
    'Paid time off',
    'Food provided',
    'Life insurance',
    'Internet reimbursement',
    'Leave encashment',
    'Flexible schedule',
    'Other'
  ];

  const toggleBenefit = (benefit) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter(b => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // ✅ get stored token
    if (!token) {
      alert('You must be logged in to post a job.');
      return;
    }

    const location = `${formData.city}, ${formData.state}`;
    const salary = `₹${formData.minsalary} - ₹${formData.maxsalary}`;
    const skills = formData.skills.split(',').map(skill => skill.trim());

    const jobData = {
      jobRole: formData.jobTitle,
      experience: formData.experienceLevel,
      companyName: formData.CName,
      jobDescription: formData.jobDescription,
      employmentType: formData.employmentType,
      salary: salary,
      location: location,
      skills: skills,
      postedDate: new Date().toISOString().slice(0, 10),
      noofpositions: formData.noofpositions,
      benefits: selectedBenefits
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ send token
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        alert('Job posted successfully!');
        setFormData({
          CName: '',
          name: '',
          Pnumber: '',
          jobTitle: '',
          experience: '',
          city: '',
          state: '',
          zip: '',
          employmentType: '',
          experienceLevel: '',
          noofpositions: '',
          recruitmentTimeline: '',
          minsalary: '',
          maxsalary: '',
          jobDescription: '',
          communication: '',
          resumeRequired: false,
          skills: ''
        });
        setSelectedBenefits([]);
      } else {
        alert('Failed to post job.');
      }
    } catch (error) {
      console.error(error);
      alert('Error posting job.');
    }
  };

  return (
    <div>
      <Header />
      

      <form onSubmit={handleSubmit}>
        <h4>Employer Account Details</h4>
        <label htmlFor="CName">Company Name</label>
        <input
          type="text"
          id="CName"
          name="CName"
          placeholder="Enter your company name"
          required
          value={formData.CName}
          onChange={handleChange}
        />

        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="Pnumber">Phone Number</label>
        <input
          type="tel"
          id="Pnumber"
          name="Pnumber"
          placeholder="Enter your phone number"
          required
          value={formData.Pnumber}
          onChange={handleChange}
        /> <hr />

        <h4>Job Basic Details</h4>

        <label htmlFor="jobTitle">Job Role</label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          placeholder="Enter job role"
          required
          value={formData.jobTitle}
          onChange={handleChange}
        />

        <label htmlFor="experience">Which option best describes this job location?</label>
        <select
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="onsite">On-site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <h4>Add job location details</h4>

        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Enter city"
          value={formData.city}
          onChange={handleChange}
        />

        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          name="state"
          placeholder="Enter state"
          value={formData.state}
          onChange={handleChange}
        />

        <label htmlFor="zip">Zip Code</label>
        <input
          type="text"
          id="zip"
          name="zip"
          placeholder="Enter zip code"
          required
          value={formData.zip}
          onChange={handleChange}
        />  <hr />

        <h4>Add job details</h4>

        <label htmlFor="employmentType">Employment Type</label>
        <select
          id="employmentType"
          name="employmentType"
          required
          value={formData.employmentType}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="fullTime">Full-time</option>
          <option value="partTime">Part-time</option>
          <option value="contract">Contract</option>
          <option value="Freelance">Freelance</option>
          <option value="Fresher">Fresher</option>
          <option value="volunteer">Volunteer</option>
          <option value="Internship">Internship</option>
        </select>

        <label htmlFor="experienceLevel">Experience</label>
        <input
          type="text"
          id="experienceLevel"
          name="experienceLevel"
          placeholder="Min Experience"
          value={formData.experienceLevel}
          onChange={handleChange}
        /> <hr />
        <label htmlFor="skills">Skills</label>
        <input
          type="text"
          id="skills"
          name="skills"
          placeholder="Enter skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        />

        <label htmlFor="noofpositions">Number of Positions</label>
        <input
          type="number"
          id="noofpositions"
          name="noofpositions"
          placeholder="Enter number of positions"
          required
          value={formData.noofpositions}
          onChange={handleChange}
        /> <hr />

        <label htmlFor="recruitmentTimeline">Recruitment time line for job</label>
        <select
          id="recruitmentTimeline"
          name="recruitmentTimeline"
          value={formData.recruitmentTimeline}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="ASAP">ASAP</option>
          <option value="1 week">1 week</option>
          <option value="2 weeks">2 weeks</option>
          <option value="1 month">1 month</option>
        </select>

        <h4>Add pay and benefits</h4>
        <div className="salary-inputs">
            <label htmlFor="minsalary">Salary per year</label>
            <p>from (starting)</p>
            <input type="number" id="minsalary" name="minsalary"placeholder="Min salary" required value={formData.minsalary || ''} onChange={handleChange} />
            <p>to (maximum)</p>
            <input type="number" id="maxsalary" name="maxsalary" placeholder="Max salary" required value={formData.maxsalary || ''} onChange={handleChange} />
        </div>

        <center><hr /></center>

        <h4>Benefits</h4>
        <div className="benefits-list">
          {benefitsList.map((benefit) => (
            <button
              type="button"
              key={benefit}
              className={`benefit-pill ${selectedBenefits.includes(benefit) ? 'selected' : ''}`}
              onClick={() => toggleBenefit(benefit)}
            >
              + {benefit}
            </button>
          ))}
        </div>

        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          placeholder="Enter job description"
          required
          value={formData.jobDescription}
          onChange={handleChange}
        ></textarea>

        <h4>Communication Type</h4>
        <label htmlFor="communication">For communication</label>
        <input
          type="text"
          id="communication"
          name="communication"
          placeholder="Enter your email/mobile for communication"
          value={formData.communication}
          onChange={handleChange}
        />

        <input
          type="checkbox"
          id="resumeRequired"
          name="resumeRequired"
          checked={formData.resumeRequired}
          onChange={handleChange}
        />
        <label htmlFor="resumeRequired">Resume required</label>

        <br />
        <div className="btnDivMobile"> 
          <button type="button" className="submitBtn" onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Hide Preview' : 'Preview'}</button>
          <button type="submit" className="submitBtn">Post Job</button>
        </div>
        
      </form>

      {showPreview && (
        <div className="preview">
          <h4>Job Preview</h4>
          <p><strong>Company Name:</strong> {formData.CName}</p>
          <p><strong>Full Name:</strong> {formData.name}</p>
          <p><strong>Phone:</strong> {formData.Pnumber}</p>
          <p><strong>Job Title:</strong> {formData.jobTitle}</p>
          <p><strong>Location Type:</strong> {formData.experience}</p>
          <p><strong>City:</strong> {formData.city}</p>
          <p><strong>State:</strong> {formData.state}</p>
          <p><strong>Zip:</strong> {formData.zip}</p>
          <p><strong>Employment Type:</strong> {formData.employmentType}</p>
          <p><strong>Experience:</strong> {formData.experienceLevel}</p>
          <p><strong>Positions:</strong> {formData.noofpositions}</p>
          <p><strong>Recruitment Timeline:</strong> {formData.recruitmentTimeline}</p>
          <p><strong>Salary:</strong> {formData.minsalary} to {formData.maxsalary}</p>
          <p><strong>Benefits:</strong> {selectedBenefits.join(', ')}</p>
          <p><strong>Description:</strong> {formData.jobDescription}</p>
          <p><strong>Communication:</strong> {formData.communication}</p>
          <p><strong>Resume Required:</strong> {formData.resumeRequired ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

export default PostAjob;
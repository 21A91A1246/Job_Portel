import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import Header from './Header';
import './common.css';
import Footer from './Footer';

const ResumeGenerator = () => {
  const location = useLocation();
  const stateJob = location.state?.job;
  const job = stateJob || JSON.parse(localStorage.getItem('selectedJob') || '{}');


  // Job data
  const [jobRole, setJobRole] = useState(job?.jobRole || '');
  const [jobDescription, setJobDescription] = useState(job?.jobDescription || '');
  const [skills, setSkills] = useState(job?.skills?.join(', ') || '');
  const [companyName, setCompanyName] = useState(job?.companyName || '');
    // Load job data from localStorage if available
  
    useEffect(() => {
    setJobRole(job.jobRole || '');
    setJobDescription(job.jobDescription || '');
    setSkills(job.skills?.join(', ') || '');
    setCompanyName(job.companyName || '');
  }, [job.jobRole, job.jobDescription, job.skills, job.companyName]);


  // User data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [extraSkills, setExtraSkills] = useState('');
  const [workExpe, setWorkExpe] = useState(''); // Optional field for work experience

  // Output
  const [resumeContent, setResumeContent] = useState('');
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResumeContent('');
    setProjects([]);
    setCerts([]);

    const requiredSkills = [
      ...skills.split(',').map(s => s.trim()),
      ...extraSkills.split(',').map(s => s.trim())
    ].filter(Boolean);

    try {
      const response = await axios.post(`${import.meta.env.REACT_APP_API_BASE_URL}/api/generate-resume`, {
        jobRole,
        jobDescription,
        requiredSkills,
        userInfo: {
          name, email, phone, college, workExpe,
        }
      });

      const data = response.data;
      setResumeContent(data.resumeContent);
      setProjects(data.suggestedProjects || []);
      setCerts(data.certifications || []);
    } catch (error) {
      console.error('Error:', error);
      setResumeContent('Something went wrong!');
    }

    setLoading(false);
  };

  return (
    <div >
        <Header />
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            
      <center><h2>AI Resume Generator</h2></center>

      <p style={{fontSize: '20px', textAlign: 'center', marginBottom: '20px'}}>Fill the details to generate your resume:</p>
      <div className="inputsDiv" style={{ display: 'flex', flexDirection: 'column', gap: '10px', }}>
        {/* User Info */}
        <input type="text" name="applicantName" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" name="applicantEmail" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="tel" name="applicantPhone" placeholder="Your Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="text" name="applicantCollege" placeholder="Your College" required value={college} onChange={(e) => setCollege(e.target.value)} />
        <input type="text" name="applicantSkills" placeholder="Add any other Skills, Projects, Certifications not mentioned in JD (comma-separated)" value={extraSkills} onChange={(e) => setExtraSkills(e.target.value)} />
        <input type="text" name="workExperience" placeholder='work Experience or internships (if any)' value={workExpe} onChange={(e) => setWorkExpe(e.target.value)} />
      </div>  <hr />

      {/* Job Role */}
      <input type="text" placeholder='Company Name' value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
      <input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

      <textarea rows={6} placeholder="Paste job description..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

      <textarea rows={2} placeholder="Required skills (comma-separated)..." value={skills} onChange={(e) => setSkills(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />

      <button onClick={handleGenerate} disabled={loading} style={{ padding: '10px 20px', fontWeight: 'bold' }}>
        {loading ? 'Generating...' : 'Generate Resume'}
      </button> <hr />
            {/* generated resume*/}
      {resumeContent && (
        <div style={{ marginTop: '10px' }}>
          <h3>Generated Resume</h3>

          {resumeContent.split('\n').map((line, index, arr) => {
            const trimmed = line.trim();

            // Detect headings like **Education** or those ending with ':'
            const isHeading =
              (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) ||
              trimmed.endsWith(':');

            if (isHeading) {
              const headingText = trimmed.replace(/\*\*/g, '').replace(':', '');
              return (
                <div key={index} style={{ }}>
                  
                  <h3 style={{ color: '#333', fontSize: '18px',marginTop:'0' }}>
                    {headingText}
                  </h3>
                </div>
              );
            }

            // Special rendering for Skills section
            if (arr[index - 1] && arr[index - 1].toLowerCase().includes('skills')) {
              return (
                <div key={index} style={{display: 'flex',flexWrap: 'wrap',gap: '10px'}} >
                  {trimmed.split(',').map((skill, i) => (
                    <span key={i}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              );
            }

            // Highlight job titles or companies (e.g., "Software Developer at XYZ")
            const isJobLine =
                (trimmed.toLowerCase().includes(' at ') || trimmed.includes('@')) &&
                !trimmed.includes('|'); // exclude lines with '|'

              if (isJobLine) {
                return (
                  <p key={index} style={{ fontWeight: '600', marginTop: '0' }}>
                    {trimmed}
                  </p>
                );
              }

            // Regular paragraph
            if (trimmed !== '') {
              return (
                <p key={index} style={{ lineHeight: '1.6', color: '#444' }}>
                  {trimmed}
                </p>
              );
            }

            return <br key={index} />;
          })}


          {/* Suggested Projects */}
          {projects.length > 0 && (
            <>
              <h4 style={{ fontWeight: 'bold' }}>Suggested Projects</h4>
              <ul>
                {projects.map((p, idx) => (
                  <li key={idx}><strong>{p.title}</strong>: {p.description}</li>
                ))}
              </ul>
            </>
          )}

          {/* Recommended Certifications */}
          {certs.length > 0 && (
            <>
              <h4 style={{ fontWeight: 'bold', marginTop: '20px' }}>Recommended Certifications</h4>
              <ul>
                {certs.map((c, idx) => (
                  <li key={idx}><strong>{c.name}</strong>: {c.description}</li>
                ))}
              </ul>
            </>
          )}
    </div>
  )}


      {/* Download Resume*/}
      {resumeContent && (
        <button
            onClick={() => {
            const doc = new jsPDF();
            const lines = doc.splitTextToSize(resumeContent, 180);
            doc.text(lines, 10, 10);
            doc.save('resume.pdf');
            }}
            style={{ marginTop: '10px', padding: '8px 16px' }}
        >
            Download as PDF
        </button>
        )}
      <b><p>*Make sure JD,Company Name,Role is not empty</p> click on create resume if u don't like the generated one</b>
        </div>

        <Footer />
    </div>
  );
};

export default ResumeGenerator;

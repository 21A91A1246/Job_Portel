import React from 'react';
import './ApplicantDashboard.css';

const recommendations = [
  {
    title: 'Senior Frontend Developer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$150k - $200k',
    skills: ['React', 'TypeScript', 'Node.js'],
    match: '95%'
  },
  {
    title: 'React Native Developer',
    company: 'Uber',
    location: 'San Francisco, CA',
    salary: '$140k - $180k',
    skills: ['React Native', 'Redux', 'JavaScript'],
    match: '92%'
  }
];

const JobRecommendations = () => {
  return (
    <div className="section">
      <center><h2>Recommended for You</h2></center>
      <div className="recommendations">
        {recommendations.map((job, i) => (
          <div key={i} className="recommendation-card">
            <div>
              <h4>{job.title}</h4>
              <p>{job.company}</p>
              <p>{job.location} • {job.salary}</p>
              <div className="skills">
                {job.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="recommendation-footer">
              <button className="apply-btn">Apply Now</button>
              <span className="match">{job.match} match</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;

// src/pages/applicant/DashboardStats.jsx
import React from 'react';
import './ApplicantDashboard.css';

const DashboardStats = ({ totalApplications }) => {
  const stats = [
    { label: 'Total Applications', value: totalApplications, change: '+12%', icon: '📁' },
    { label: 'Profile Views', value: 156, change: '+8%', icon: '👁️' },
    { label: 'Saved Jobs', value: 8, change: '+3', icon: '🔖' },
    { label: 'Interview Rate', value: '18%', change: '+5%', icon: '📈' }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <div key={i} className="stat-card">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-info">
            <h4>{stat.label}</h4>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-change">{stat.change} from last month</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

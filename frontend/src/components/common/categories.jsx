import React from 'react';
import {
  FaCode, FaPaintBrush, FaChartLine, FaUsers,
  FaWrench, FaHeartbeat, FaFileInvoiceDollar, FaGraduationCap
} from 'react-icons/fa';
import './common.css'; // Import the CSS file

const categories = [
  { icon: <FaCode className="icon blue" />, label: 'Technology', jobs: 12450 },
  { icon: <FaPaintBrush className="icon purple" />, label: 'Design', jobs: 3280 },
  { icon: <FaChartLine className="icon green" />, label: 'Marketing', jobs: 5670 },
  { icon: <FaUsers className="icon orange" />, label: 'Sales', jobs: 4890 },
  { icon: <FaWrench className="icon red" />, label: 'Engineering', jobs: 6230 },
  { icon: <FaHeartbeat className="icon pink" />, label: 'Healthcare', jobs: 8450 },
  { icon: <FaFileInvoiceDollar className="icon indigo" />, label: 'Finance', jobs: 3980 },
  { icon: <FaGraduationCap className="icon yellow" />, label: 'Education', jobs: 2340 },
];

const JobCategories = () => {
  return (
    <div className="job-grid">
      {categories.map((cat, index) => (
        <div className="job-card" key={index}>
          <div className="icon-container">{cat.icon}</div>
          <h3>{cat.label}</h3>
          <p>{cat.jobs.toLocaleString()} jobs</p>
        </div>
      ))}
    </div>
  );
};

export default JobCategories;

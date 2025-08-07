import React from 'react';
import { Link } from 'react-router-dom';
import {FaBars,FaPlusCircle, FaBriefcase,  FaUserFriends, FaUsers, FaRegCalendarAlt, FaChartBar, FaFolder} from 'react-icons/fa';
import './dashboard.css';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  // Toggle sidebar state
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className='iconsDiv' onClick={toggleSidebar}>
        <FaBars />
        {!isCollapsed && <span>Collapse</span>}
      </div>
      <div className='iconsDiv'>
        <FaPlusCircle />
        {!isCollapsed && <span><Link  to='/hiringPage' >Post Job</Link></span>}
      </div>
      <div className='iconsDiv'>
        <FaBriefcase />
        {!isCollapsed && <span><Link to='/PostedJobs'>Posted Jobs</Link></span>}
      </div>
      {/* <div className='iconsDiv'>
        <FaPhone />
        {!isCollapsed && <span>Phone Calls</span>}
      </div> */}
      <div className='iconsDiv'>
        <FaUserFriends />
        {!isCollapsed && <span>Smart Sourcing</span>}
      </div>
      <div className='iconsDiv'>
        <FaUsers />
        {!isCollapsed && <span><Link to='/PostedJobs'>Candidates</Link></span>}
      </div>
      <div className='iconsDiv'>
        <FaRegCalendarAlt />
        {!isCollapsed && <span>Interviews</span>}
      </div>
      <div className='iconsDiv'>
        <FaChartBar />
        {!isCollapsed && <span>Analytics</span>}
      </div>
      <div className='iconsDiv'>
        <FaFolder />
        {!isCollapsed && <span>Tools</span>}
      </div>
    </div>
  );
};

export default Sidebar;

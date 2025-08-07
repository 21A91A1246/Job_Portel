// src/pages/EmployerDashboard.jsx
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome, FaQuestionCircle, FaBell, FaEnvelope,
  FaBars, FaTimes
} from 'react-icons/fa';
import Sidebar from './Sidebar';
import './dashboard.css';

// ✅ JWT decoder
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const EmployerDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const user = token ? parseJwt(token) : null;

  useEffect(() => {
      if (!token) {
        navigate('/login');
      } else {
        const decoded = parseJwt(token);
        if (decoded && decoded.exp * 1000 < Date.now()) {
          toast.info('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          setTimeout(() => {
            navigate('/login');
          }, 1500); // Wait 1.5 seconds before redirecting
        }
      }
    }, [token, navigate]);



  const handlePostJobClick = () => navigate('/hiringPage');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="dashboard-wrapper">
      {/* ✅ Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* ✅ Main Content */}
      <div className={`employer-dashboard ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <header className="navbar" >
          <div className="mobileDiv">
            <div className="logo">JobPortal</div>

            <div className="hamburger-icon" onClick={toggleMobileMenu}> {/* ✅ Hamburger icon for mobile */}
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
          <div className="empHeader" >
              <nav className={`navbar-nav ${isMobileMenuOpen ? 'show' : ''}`}>
                <Link to="/"> <FaHome /> Home </Link>
                <a href="#help"><FaQuestionCircle /> Help</a>
                <a href="#notifications"><FaBell /> Notifications</a>
                <a href="#messages"><FaEnvelope /> Messages</a>
                {!user ? (
                  <>
                    <Link to="/login">Employer Login</Link>
                    <Link to="/register">Employer Register</Link>
                  </>
                ) : (
                  <Link to="#" onClick={handleLogout}>Logout</Link>
                )}
              </nav>
          </div>
          
        </header>
                
        <div style={{ display: 'flex' }}>
          <h1>Employer Dashboard</h1>
          <p style={{ marginLeft: 'auto', marginTop: '10px' }}>
            Welcome back, {userEmail}!
          </p>
        </div>

        <hr />

        <div className="dbactions">
          <div>
            <b>Jobs</b> <button>All Jobs</button> <button>Tags</button>
          </div>
          <div>
            <button onClick={handlePostJobClick} className="post-job-button">
              Post Jobs
            </button>
          </div>
        </div>

        <hr />

        <div>
          <center>
            <div className="dashboard-hero">
              <img src="/imgs/empdboard.png" alt="Dashboard Banner" />
            </div>
            <h3>
              Get up to 4x more applications. Post your first job directly on Indeed.
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Indeed Apply brings you up to four times more applications than
              redirecting applications to your career website. Make it simpler.
              Hire faster.
            </p>
            <button onClick={handlePostJobClick} className="post-job-button">
              Post a Job
            </button>
          </center>
        </div>

        <hr />

        <footer>
          <center>
            <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
            <p>
              Contact us:{' '}
              <a href="mailto:support@jobportal.com">support@jobportal.com</a>
            </p>
          </center>
        </footer>
      </div>
    </div>
  );
};

export default EmployerDashboard;

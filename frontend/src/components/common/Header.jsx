// src/components/common/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './common.css';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setMenuOpen(false);
    navigate('/login');
  };

  const handleFindJobs = () => {
    setMenuOpen(false);
    navigate(token ? '/ApplicantDashboard' : '/login');
  };
  
  return (
    <header className="navbar" style={{borderBottom:'1px solid gray'}}>

      {/* Toggle Menu Icon */}
      {!menuOpen ? (
       <FaBars className="menu-icon" style={{marginRight:'30px'}} onClick={() => setMenuOpen(true)} />
      ) : (
        <FaTimes className="menu-icon" onClick={() => setMenuOpen(false)} />
      )}

      <nav className={`navbar-nav ${menuOpen ? 'active' : ''}`} >
        
          
          <div style={{display:'flex',gap:'10px'}}>
            <Link to="/" onClick={() => setMenuOpen(false)} style={{textDecoration:'none',color:'#4497f0',fontWeight:'700',fontSize:'bold'}}>Jobs Portel</Link>
            <span onClick={handleFindJobs} style={{ cursor: 'pointer' }}>Find Jobs</span>            
            <Link to="#" onClick={() => setMenuOpen(false)}>Companies</Link>
            <Link to="#" onClick={() => setMenuOpen(false)}>Career Advice</Link>
          </div>

        <div style={{display:'flex',gap:'10px'}}>
          {token ? (
          <>
            <span className="user-email"> {email}</span>
            <Link
              to="/login"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Logout
            </Link>
            
          </>
        ) : (
          <>
            <Link to="/register" onClick={() => setMenuOpen(false)}><FaUser/> Register</Link>
            <Link to="/PostJobs" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          </>
        )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

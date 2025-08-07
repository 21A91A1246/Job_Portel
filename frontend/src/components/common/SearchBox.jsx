// src/components/common/SearchBar.jsx
import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import './common.css';

function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  const [locationText, setLocationText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const job = searchText.trim();
    const location = locationText.trim() || 'India';

    if (!job && !location) {
      alert('Please enter a job title or keyword.');
      return;
    }

    onSearch(job, location);
  };

  const setAndSearch = (jobTitle) => {
    setSearchText(jobTitle);
    onSearch(jobTitle, locationText || 'India');
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <center>
            <h2 className="hero-title">
              Find Your Dream <span className="highlight">Career Today</span>
            </h2>
          </center>
          <center>
            <p className="hero-description">
              Connect with top employers and discover opportunities that match your skills, passion, and career goals in our vast network of premium job listings.
            </p>
          </center>

          <form
            className="search-bar-form"
            onSubmit={handleSubmit}
            style={{ display: 'flex', paddingTop: '20px', paddingBottom: 0 }}
          >
            <div className="search-field">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-field">
              <FaMapMarkerAlt className="search-icon" />
              <input
                type="text"
                placeholder="City, State, or Remote"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                className="search-input"
              />
            </div>

            <button type="submit" className="search-button" style={{ marginTop: 0 }}>
              Search Jobs
            </button>
          </form>

          <div className="popular-searches">
            <span>Popular searches:</span>
            <button type="button" onClick={() => setAndSearch('Remote Developer')}>Remote Developer</button>
            <button type="button" onClick={() => setAndSearch('Marketing Manager')}>Marketing Manager</button>
            <button type="button" onClick={() => setAndSearch('Data Scientist')}>Data Scientist</button>
            <button type="button" onClick={() => setAndSearch('Product Designer')}>Product Designer</button>
          </div>
        </div>
      </div>
      {/* <div className='browseJobsByCategory'>
        <h2>jobs categories</h2>

      </div> */}
    </section>
  );
}

export default SearchBar;

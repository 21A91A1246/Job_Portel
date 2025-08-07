import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header'
import './pages.css';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import BecomeEmployer from '../components/common/BecomeEmployeer';

function PostJobs() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);
  return (
    <div className='postjob'>
      <Header/>
      <img src='../imgs/postJob.png' alt="img"  />

        <div>
          {/* ✅ Show Dashboard if user is logged in (any role) */}
          {userRole !== 'employee' && (
            
            <Link to='/Employee-Dashboard'>
              <BecomeEmployer />
            </Link>

          )}

          {/* ✅ Show Register button ONLY if user is NOT an employer */}
          {userRole === 'employer' && (
            <Link to='/Employee-Dashboard'>
              <button>Dashboard</button>
            </Link>
          )}
        </div>

      <center >Manage your hiring from start to finish<hr /></center> 
      <div className='fourdivs'>
        <div>
          <b>Post a job</b>
          <p>Get started with a job post. Indeed has 1.56 crore unique monthly users.</p>​
        </div>
        <div>
          <b>Find quality applicants</b>
          <p>Customise your post with screening tools to help narrow down to potential candidates.</p>
        </div>
        <div>
          <b>Make connections</b>
          <p>Track, message, invite, and interview directly on Indeed and with the Indeed for Employers mobile app.</p>
        </div>
        <div>
          <b>Hire confidently</b>
          <p>You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process.</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
  <div style={{ flex: 1, height: '1px', backgroundColor: 'gray' }} />
  <span style={{ padding: '0 10px', color: 'ORANGE', fontWeight: 'bold',fontSize: '1.5rem' }}>
    YOUR DASHBOARD FEATURES
  </span>
  <div style={{ flex: 1, height: '1px', backgroundColor: 'gray' }} />
</div>

      <div className='dbfeatures'>
        <div className='dfleft'>
          <hr />
          <details>
            <summary>Manage your jobs</summary>
            <p>Your dashboard helps you keep up with your hiring priorities. Manage open jobs, update job statuses and filter applications easily.</p>
          </details><hr />

          <details>
            <summary>Choose who moves forward</summary>
            <p>Mark the applicants you’re interested in, and we’ll automatically decline the rest for you.</p>
          </details><hr />
          <details>
            <summary>Interview anywhere</summary>
            <p>Schedule and conduct virtual interviews directly from our platform. No downloads required.</p>
          </details>
          <hr />
        </div>

        <div>
          <h2><img src="/imgs/requirment.png" alt="Profile" style={{ height: '22rem',width:'100%',marginLeft:'80px' }} /></h2>
        </div>
      </div> <hr />

      <div className='divthree'>
        <div className='divthreeleft'><img src="/imgs/aisha.webp" alt="Profile" /></div>
        <div className='divthreeright'>
          <h4>Unlock matched candidates with Indeed Smart Sourcing</h4>
          <p>When you have a job posted and add an Indeed Smart Sourcing subscription, you immediately start seeing candidates whose CVs on Indeed fit your job description. When someone stands out, invite them to apply.</p>
        </div>
      </div> <hr />

      <div className='divthree'>
        <div className='divthreeright'>
          <h4>Unlock matched candidates with Indeed Smart Sourcing</h4>
          <p>Learn everything you need to know about managing your account, navigating your dashboard and more.</p>
        </div>

        <div className='divthreeleft'>
          <img src="/imgs/ladder-bookshelf.webp" alt="Profile" />
        </div>
      </div>

      <Footer/>

    </div>
  )
}

export default PostJobs

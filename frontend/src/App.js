// src/App.jsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import PostJobs from './pages/PostJobs';
import PostAjob from './components/jobs/PostAjob';
import EmpDashboard from './components/dashboard/EmpDashboard';
import Sidebar from './components/dashboard/Sidebar';
import PostedJobs from './components/dashboard/PostedJobs';
import Footer from './components/common/Footer';
import ResumeGenerator from './components/common/ResumeGenerator';
import ApplicantDashboard from './components/dashboard/ApplicantDashboard/ApplicantDashboard.jsx';

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Jobs" element={<JobsPage />} />
        <Route path="/PostJobs" element={<PostJobs />} />
        <Route path="/hiringPage" element={<PostAjob />} />
        <Route path="/Employee-Dashboard" element={<EmpDashboard />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/PostedJobs" element={<PostedJobs />} />
        <Route path="/ResumeGenerator" element={<ResumeGenerator />} />
        <Route path="/ApplicantDashboard" element={<ApplicantDashboard />} />
        <Route path="/Footer" element={<Footer />} />
      </Routes>
    </>
  );
}

export default App;

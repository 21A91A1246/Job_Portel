const express = require('express');
const router = express.Router();
const { auth, employerOnly } = require('../middleware/auth');
const Applicant = require('../models/Applicant'); // ✅ USE your applicant.js model

const Job = require('../models/Job');

// ✅ Already existing: GET jobs for employer
router.get('/jobs', auth, employerOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId });
    res.json({ jobs });
  } catch (err) {
    console.error('Error fetching employer jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ NEW: GET applicants for a specific job
router.get('/applicants/:jobId', auth, employerOnly, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applicants = await Applicant.find({ jobId });

    res.json({
      applicants: applicants.map(app => ({
        _id: app._id,
        applicantName: app.applicantName,
        applicantEmail: app.applicantEmail,
        applicantDate: app.appliedAt,
        resumePath: app.resumePath
      }))
    });
  } catch (err) {
    console.error('Error fetching applicants:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

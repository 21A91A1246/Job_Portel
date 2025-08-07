const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');

// GET /api/user-applied
router.get('/', auth, async (req, res) => {
  try {
    // Find all applications by logged-in user
    const applications = await Applicant.find({ userId: req.user.userId });

    // Extract job IDs from applications
    const jobIds = applications.map(app => app.jobId);

    // Fetch job details for those job IDs
    const jobs = await Job.find({ _id: { $in: jobIds } });

    // Merge job and applicant info
    const result = jobs.map(job => {
      const app = applications.find(a => a.jobId.toString() === job._id.toString());
      return {
        jobRole: job.jobRole,
        companyName: job.companyName,
        location: job.location,
        appliedAt: app ? app.createdAt : null,
        applicantName: app ? app.applicantName : null,
        mobileNumber: app ? app.mobileNumber : null,
        resumeFilename: app && app.resume ? app.resume.filename : null,
        jobId: job._id,
      };
    });
    console.log('User applied jobs data:', result);
    res.json(result);
  } catch (err) {
    console.error('Error fetching applied job details:', err);
    res.status(500).json({ message: 'Error fetching applied job details' });
  }
});

module.exports = router;

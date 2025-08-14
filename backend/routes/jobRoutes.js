const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth, employerOnly } = require('../middleware/auth');

// ✅ POST — create job
router.post('/', auth, employerOnly, async (req, res) => {
    // console.log('POST /api/jobs hit'); // 🔍 Debug line

  try {
    const {
      jobRole, experience, companyName, jobDescription,
      employmentType, salary, location, skills,
      noofpositions, benefits
    } = req.body;

    const newJob = new Job({
      jobRole,
      experience,
      companyName,
      jobDescription,
      employmentType,
      salary,
      location,
      skills,
      noofpositions,
      benefits,
      postedBy: req.user.userId
    });

    await newJob.save();
    res.status(201).json({ message: '✅ Job posted', job: newJob });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: 'Server error posting job' });
  }
});

// ✅ GET — search & location filter
router.get('/', async (req, res) => {
  const { search = '', location = '' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { jobRole: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
      { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
    ];
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  try {
    const jobs = await Job.find(query).populate('postedBy', 'username email');
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

module.exports = router;

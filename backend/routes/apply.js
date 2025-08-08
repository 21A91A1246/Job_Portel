const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Applicant = require('../models/Applicant');
const Job = require('../models/Job');
const User = require('../models/User');
const multer = require('multer');
const sendMail = require('../utils/sendMail');

// ✅ Set up Multer to accept a single file with field name 'resume'
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Optional: limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF or Word documents are allowed.'));
    }
  },
});

// ✅ POST route to handle job application
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    // Fetch job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Fetch user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Save application
    const newApplication = new Applicant({
      userId: req.user.userId,
      jobId,
      applicantName: req.body.applicantName,
      mobileNumber: req.body.applicantPhone,
      resume: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname,
      },
    });
    await newApplication.save();


    // Send confirmation email
    const success = await sendMail({
      to: user.email,
      subject: `Application Received: ${job.jobRole}`,
      text: `Thank you for applying to ${job.companyName}`,
      html: `
      <p>Hello ${user.username},</p>
      <p>
        Thanks for applying to <strong>${job.companyName}</strong> for the <strong>${job.jobRole}</strong> role.
        We’ll contact you soon.
      </p>
      <p>
        <a href="https://job-portel-nine.vercel.app" target="_blank"
          style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
          View Application
        </a>
      </p>
      <p>Visit the JobPortal website for more open positions.</p>
      `,
      html: `<p>Hello ${user.username},</p>
      <p>
        Thanks for applying to <strong>${job.companyName}</strong> for the <strong>${job.jobRole}</strong> role.
        We’ll contact you soon.
      </p>
      <p>
        <a href="https://job-portel-nine.vercel.app" target="_blank"
          style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
          View Application
        </a>
      </p>
      <p>Visit the JobPortal website for more open positions.</p>`,
    });

    if (success) {
      res.status(200).json({ message: 'Application submitted and email sent.' });
    } else {
      res.status(500).json({ message: 'Application saved, but email sending failed.' });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error while submitting application.' });
  }
});

module.exports = router;

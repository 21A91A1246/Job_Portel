// models/Applicant.js
const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  jobId: { type: String, required: true },
  
  applicantName: { type: String, required: true },
  mobileNumber: { type: String, required: true },

  resume: {
    data: Buffer,
    contentType: String,
    filename: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Applicant', ApplicantSchema);

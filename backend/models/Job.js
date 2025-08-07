const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobRole: String,
  experience: String,
  companyName: String,
  jobDescription: String,
  employmentType: String,
  salary: String,
  location: String,
  skills: [String],
  postedDate: { type: Date, default: Date.now },
  noofpositions: Number,
  benefits: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Employer'
    required: false // ✅ Make optional for Adzuna jobs
  },

  // ✅ For Adzuna/External Jobs
  externalId: { type: String, unique: true, sparse: true }, // Unique Adzuna ID
  redirectUrl: String, // Adzuna job link

  // ✅ For TTL cleanup (applies to both)
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Job', JobSchema);


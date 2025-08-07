require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const jobs = JSON.parse(fs.readFileSync('jobs.json', 'utf-8'));
    return Job.insertMany(jobs);
  })
  .then(() => {
    console.log('✅ Jobs imported successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    mongoose.disconnect();
  });

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Job = require('../models/Job'); // Adjust path if needed

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

async function run() {
  try {
    // 1️⃣ Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 2️⃣ Find Adzuna jobs with missing description OR salary
    const jobs = await Job.find({
      externalId: { $exists: true },
      $or: [
        { jobDescription: { $exists: false } },
        { jobDescription: '' },
        { salary: { $exists: false } },
        { salary: null }
      ]
    });

    console.log(`Found ${jobs.length} jobs missing descriptions or salary.`);

    for (const job of jobs) {
      try {
        // 3️⃣ Fetch details from Adzuna
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1`;
        const response = await axios.get(url, {
          params: {
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            results_per_page: 1,
            what: job.jobRole,
            where: job.location
          }
        });

        const result = response.data.results.find(r => r.id === job.externalId);
        if (result) {
          // ✅ Update only if missing
          if (!job.jobDescription) {
            job.jobDescription = result.description;
          }
          if (job.salary == null && result.salary?.average) {
            job.salary = result.salary.average;
          }
          await job.save();
          console.log(`✅ Updated job ${job.externalId}`);
        } else {
          console.warn(`⚠ No matching Adzuna result for job ${job.externalId}`);
        }
      } catch (err) {
        console.error(`❌ Error updating job ${job.externalId}:`, err.message);
      }
    }

    console.log('🎉 Re-sync complete');
    process.exit(0);

  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

run();

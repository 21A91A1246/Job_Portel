const express = require('express');
const axios = require('axios');
const router = express.Router();
const Job = require('../models/Job');

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

router.get('/adzuna', async (req, res) => {
  const what = req.query.what || '';
  const where = req.query.where || '';

 if (!what && !where) {
      return res.status(400).json({ error: 'Please specify at least a job title or location.' });
    }

  try {
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1', {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        what,
        where,
        max_days_old: 30,
        sort_by: 'date',
        results_per_page: 10,
      }
    });

    const jobs = response.data.results;

    // Upsert each job, then collect saved jobs to return
    const savedJobs = [];

    for (const job of jobs) {
      try {
        const jobData = {
          externalId: job.id,
          jobRole: job.title,
          companyName: job.company.display_name,
          location: job.location.display_name,
          salary: job.salary_max || job.salary_min || null,
          jobDescription: job.description,
          redirectUrl: job.redirect_url,
          createdAt: new Date()
        };

        // Upsert: update if exists, insert if not
        const saved = await Job.findOneAndUpdate(
          { externalId: job.id },
          { $set: jobData },  // use $set to update fields as well (better)
          { new: true, upsert: true }
        );

        savedJobs.push(saved);
      } catch (insertErr) {
        console.warn('Job duplicate or insert failed:', insertErr.message);
      }
    }

    // Return only the upserted jobs (no extra jobs)
    res.json(savedJobs);
    console.log(savedJobs);

  } catch (error) {
    console.error('Adzuna API error:', {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });

    res.status(500).json({
      error: 'Failed to fetch Adzuna jobs',
      detail: error.response?.data || error.message,
    });
  }
});

module.exports = router;

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
        max_days_old: 15,        // fetch jobs no older than 15 days
        sort_by: 'date',         // sort by posting date (newest first)
        order: 'desc',
        results_per_page: 10,
      }
    });

    const jobs = response.data.results;

    const savedJobs = [];

    for (const job of jobs) {
      try {
        const jobData = {
          externalId: job.id,
          jobRole: job.title,
          companyName: job.company?.display_name || 'Unknown',
          location: job.location?.display_name || 'Unknown',
          salary: job.salary_max || job.salary_min || null,
          jobDescription: job.description || '',
          redirectUrl: job.redirect_url || '',
          createdAt: job.created ? new Date(job.created) : new Date(),
        };

        // Upsert the job by externalId, overwrite all fields including jobDescription
        const saved = await Job.findOneAndUpdate(
          { externalId: job.id },
          { $set: jobData },
          { new: true, upsert: true }
        );

        savedJobs.push(saved);
      } catch (insertErr) {
        console.warn('Job upsert failed:', insertErr.message);
      }
    }

    // Respond with the saved jobs after upserting
    res.json(savedJobs);
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

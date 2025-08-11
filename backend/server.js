require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json()); // ✅ This is required for parsing JSON POST bodies


// ✅ Allow multiple origins via env or fallback to local
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Import AI and other routes
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/jobRoutes');
const applyRoutes = require('./routes/apply');
const appliedJobIds = require('./routes/userApplied');
const adzunaRoutes = require('./routes/adzuna');
const employerRoutes = require('./routes/employer');



// API routes
app.use('/api', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/apply', applyRoutes);
app.use('/api/user-applied', appliedJobIds);
app.use('/api', adzunaRoutes);
app.use('/api/employer', employerRoutes);

// In routes or app.js
app.post('/api/applications', (req, res) => {
  // handle resume upload and application saving
});


// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});
// mongoose.connection.on('connected', () => {
//   console.log('✅ Connected to MongoDB');
//   console.log('➡️  Using DB:', mongoose.connection.name); // <== PRINTS DB NAME
// });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(async () => {
    console.log(':) MongoDB connected');

    // ✅ Setup TTL and unique index (runs once, safe to keep here)
    const Job = require('./models/Job');
    try {
      await Job.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days
      await Job.collection.createIndex({ externalId: 1 }, { unique: true, sparse: true });
      console.log('✅ Indexes created for Job collection');
    } catch (error) {
      console.error('❌ Failed to create indexes:', error.message);
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
}


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


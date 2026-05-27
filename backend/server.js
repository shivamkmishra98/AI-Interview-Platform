const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const morgan = require('morgan');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route files
const auth = require('./routes/authRoutes');
const interview = require('./routes/interviewRoutes');
const user = require('./routes/userRoutes');
const feedback = require('./routes/feedbackRoutes');
const execute = require('./routes/executeRoutes');
const detect = require('./ai-detection/detectionRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/interview', interview);
app.use('/api/user', user);
app.use('/api/feedback', feedback);
app.use('/api/execute', execute);
app.use('/api/detect-answer', detect);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the AI Interview Platform API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

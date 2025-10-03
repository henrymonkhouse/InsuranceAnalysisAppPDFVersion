const express = require('express');
const cors = require('cors');
const path = require('path');
const bookletRoutes = require('./routes/booklet/bookletRoutes');
const pdfRoutes = require('./routes/pdf/pdfRoutes');
const errorHandler = require('./middleware/errorHandler');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || (process.env.ELECTRON_MODE === 'true' ? 5001 : 3001);

// Initialize data directory
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
const corsOrigins = ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:5000'];
if (process.env.ELECTRON_MODE === 'true') {
  corsOrigins.push('file://'); // Allow Electron file protocol
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or postman)
    if (!origin) return callback(null, true);
    
    if (corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/booklets', bookletRoutes);
app.use('/api/pdf', pdfRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
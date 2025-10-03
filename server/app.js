const express = require('express');
const cors = require('cors');
const bookletRoutes = require('./routes/booklet/bookletRoutes');
const pdfRoutes = require('./routes/pdf/pdfRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/booklets', bookletRoutes);
app.use('/api/pdf', pdfRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
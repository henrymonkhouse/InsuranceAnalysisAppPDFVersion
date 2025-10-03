const express = require('express');
const router = express.Router();
const pdfController = require('../../controllers/pdf/pdfController');

// Generate PDF from saved booklet
router.get('/generate/:bookletId', pdfController.generatePDF);

// Generate PDF from posted data
router.post('/generate', pdfController.generatePDFFromData);

module.exports = router;
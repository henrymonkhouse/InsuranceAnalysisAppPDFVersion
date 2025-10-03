const pdfGeneratorService = require('../../services/pdf/pdfGeneratorService');
const bookletStorageService = require('../../services/booklet/bookletStorageService');

const generatePDF = async (req, res) => {
  try {
    const { bookletId } = req.params;
    
    if (!bookletId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booklet ID is required' 
      });
    }
    
    // Get booklet data
    const bookletData = bookletStorageService.getBooklet(bookletId);
    
    if (!bookletData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booklet not found' 
      });
    }
    
    // Generate PDF
    const pdfBuffer = await pdfGeneratorService.generatePDF(bookletData);
    
    // Set response headers for PDF download
    const orgName = bookletData.metadata?.name || bookletData.data?.sharedDetails?.organizationName || 'booklet';
    const filename = `${orgName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF buffer
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF',
      error: error.message 
    });
  }
};

const generatePDFFromData = async (req, res) => {
  try {
    const bookletData = req.body;
    
    if (!bookletData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booklet data is required' 
      });
    }
    
    // Generate PDF directly from provided data
    const pdfBuffer = await pdfGeneratorService.generatePDF(bookletData);
    
    // Set response headers for PDF download
    const orgName = bookletData.metadata?.name || bookletData.data?.sharedDetails?.organizationName || 'booklet';
    const filename = `${orgName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF buffer
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF',
      error: error.message 
    });
  }
};

module.exports = {
  generatePDF,
  generatePDFFromData
};
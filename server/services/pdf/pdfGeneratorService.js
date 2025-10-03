const PDFDocument = require('pdfkit');

class PDFGeneratorService {
  async generatePDF(bookletData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'LETTER',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const tabsData = bookletData.data?.tabs || bookletData;
        
        // Cover page
        this.addCoverPage(doc, bookletData);

        // Generate MedUHC page if it has data
        if (tabsData.medUHC) {
          doc.addPage();
          this.generateMedUHCTabContent(doc, tabsData.medUHC);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  addCoverPage(doc, bookletData) {
    const orgName = bookletData.metadata?.name || bookletData.data?.sharedDetails?.organizationName || 'Benefits Summary';
    
    doc.fontSize(24).fillColor('#003366').text('Benefits Summary', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(16).fillColor('#333').text(orgName, { align: 'center' });
    doc.moveDown(3);
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'left' });
  }

  generateMedUHCTabContent(doc, data) {
    doc.fontSize(18).fillColor('#003366').text('Medical - UHC Plan', { underline: true });
    doc.moveDown(1);

    // Get column names from the data
    const columns = this.extractColumns(data);
    
    // Plan Information Section
    this.addTableSection(doc, 'PLAN INFORMATION', '#3B82F6', [
      { label: 'Plan Name', data: data.planDetails?.plans || {} },
      { label: 'Network', data: data.planDetails?.networks || {} },
      { label: 'Overview', data: data.planDetails?.overviews || {} }
    ], columns);

    // Annual Deductible Section
    this.addTableSection(doc, 'ANNUAL DEDUCTIBLE', '#0EA5E9', [
      { label: 'Individual', data: data.deductibles?.individual || {} },
      { label: 'Family', data: data.deductibles?.family || {} }
    ], columns, true);

    // Out of Pocket Section
    this.addTableSection(doc, 'ANNUAL MAXIMUM OUT OF POCKET', '#0EA5E9', [
      { label: 'Individual', data: data.outOfPocket?.individual || {} },
      { label: 'Family', data: data.outOfPocket?.family || {} }
    ], columns, true);

    // Coinsurance Section
    if (data.coinsuranceValues) {
      this.addTableSection(doc, 'COINSURANCE', '#10B981', [
        { label: 'Regular', data: data.coinsuranceValues.regular || {} }
      ], columns);
    }

    // Physician Visits Section
    if (data.physicianVisits) {
      this.addTableSection(doc, 'PHYSICIAN VISITS', '#10B981', 
        Object.entries(data.physicianVisits).map(([key, value]) => ({
          label: this.formatLabel(key),
          data: value || {}
        })), columns);
    }

    // Hospital Services Section
    if (data.hospitalServices) {
      this.addTableSection(doc, 'HOSPITAL SERVICES', '#DC2626', 
        Object.entries(data.hospitalServices).map(([key, value]) => ({
          label: this.formatLabel(key),
          data: value || {}
        })), columns);
    }

    // Prescription Drug Section
    if (data.prescriptionDrug) {
      this.addTableSection(doc, 'PRESCRIPTION DRUG BENEFIT', '#7C3AED', 
        Object.entries(data.prescriptionDrug).map(([key, value]) => ({
          label: this.formatLabel(key),
          data: value || {}
        })), columns);
    }
  }

  extractColumns(data) {
    const columnSet = new Set();
    
    // Check all sections for column IDs
    const sections = [
      data.planDetails?.plans,
      data.planDetails?.networks, 
      data.planDetails?.overviews,
      data.deductibles?.individual,
      data.deductibles?.family,
      data.outOfPocket?.individual,
      data.outOfPocket?.family
    ];

    sections.forEach(section => {
      if (section && typeof section === 'object') {
        Object.keys(section).forEach(key => columnSet.add(key));
      }
    });

    return Array.from(columnSet);
  }

  addTableSection(doc, title, color, rows, columns, isDollar = false) {
    if (rows.length === 0 || columns.length === 0) return;
    
    // Check if we need a new page
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }

    // Section header with color
    this.addColoredHeader(doc, title, color);
    
    // Create table
    this.createTable(doc, rows, columns, isDollar);
    doc.moveDown(1);
  }

  addColoredHeader(doc, title, color) {
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const startY = doc.y;
    
    // Draw colored rectangle
    doc.rect(doc.page.margins.left, startY, pageWidth, 20)
       .fillAndStroke(color, color);
    
    // Add white text
    doc.fontSize(10)
       .fillColor('#FFFFFF')
       .text(title, doc.page.margins.left + 8, startY + 5);
    
    doc.y = startY + 25;
  }

  createTable(doc, rows, columns, isDollar = false) {
    const startX = doc.page.margins.left;
    const startY = doc.y;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const labelWidth = 120;
    const dataWidth = (pageWidth - labelWidth) / columns.length;
    const rowHeight = 18;

    // Header row
    doc.rect(startX, startY, pageWidth, rowHeight)
       .fillAndStroke('#F8F9FA', '#DEE2E6');
    
    doc.fontSize(9).fillColor('#495057');
    doc.text('Benefit', startX + 5, startY + 4);
    
    columns.forEach((col, index) => {
      doc.text(this.formatLabel(col), startX + labelWidth + (index * dataWidth) + 5, startY + 4, { width: dataWidth - 10 });
    });

    // Data rows
    let currentY = startY + rowHeight;
    
    rows.forEach((row, rowIndex) => {
      if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        currentY = doc.page.margins.top;
      }

      // Row background
      const bgColor = rowIndex % 2 === 0 ? '#FFFFFF' : '#F8F9FA';
      doc.rect(startX, currentY, pageWidth, rowHeight)
         .fillAndStroke(bgColor, '#DEE2E6');

      // Label column
      doc.fontSize(9).fillColor('#212529')
         .text(row.label, startX + 5, currentY + 4, { width: labelWidth - 10 });

      // Data columns
      columns.forEach((col, colIndex) => {
        let value = '';
        if (row.data && typeof row.data === 'object' && row.data[col] !== undefined) {
          value = String(row.data[col]);
          if (isDollar && value && value !== '') {
            value = '$' + value;
          }
        }
        
        doc.text(value, startX + labelWidth + (colIndex * dataWidth) + 5, currentY + 4, { width: dataWidth - 10 });
      });

      currentY += rowHeight;
    });

    doc.y = currentY + 5;
  }

  formatLabel(str) {
    if (!str) return '';
    return String(str)
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char => char.toUpperCase())
      .trim();
  }
}

module.exports = new PDFGeneratorService();
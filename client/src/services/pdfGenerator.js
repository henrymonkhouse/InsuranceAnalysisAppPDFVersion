import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Font, Image } from '@react-pdf/renderer';

// Register fonts if needed
// Font.register({
//   family: 'Inter',
//   src: '/fonts/Inter-Regular.ttf'
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #4F46E5',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    margin: 10,
    padding: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4F46E5',
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 12,
    color: '#1F2937',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
  },
});

// Helper component for fields
const Field = ({ label, value }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || 'N/A'}</Text>
  </View>
);

// PDF Document Component
const BenefitsBookletPDF = ({ booklet }) => {
  const { metadata, data } = booklet;
  const { sharedDetails, tabs } = data;

  // Helper to format currency
  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper to format percentage
  const formatPercentage = (value) => {
    if (!value) return 'N/A';
    return `${value}%`;
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Insurance Benefits Booklet</Text>
          <Text style={styles.subtitle}>{metadata.name}</Text>
        </View>
        
        <View style={styles.section}>
          <Field label="Organization" value={sharedDetails.organizationName} />
          <Field label="Effective Date" value={sharedDetails.effectiveDate} />
          {metadata.description && <Field label="Description" value={metadata.description} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table of Contents</Text>
          {metadata.selectedTabs.map((tabId, index) => (
            <Text key={tabId} style={{ fontSize: 12, marginBottom: 5 }}>
              {index + 1}. {getTabLabel(tabId)}
            </Text>
          ))}
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>

      {/* Medical UHC Tab */}
      {tabs.medUHC && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Medical UHC Plan Details</Text>
          
          {/* Plan Information */}
          <View style={styles.section}>
            <Field label="Current Plan" value={tabs.medUHC.planDetails?.currentPlan} />
            <Field label="Renewal Plan" value={tabs.medUHC.planDetails?.renewalPlan} />
            <Field label="Alternate Plan" value={tabs.medUHC.planDetails?.alternatePlan} />
          </View>

          {/* Deductibles */}
          {tabs.medUHC.deductibles && (
            <View style={styles.section}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>Deductibles</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Type</Text></View>
                  <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Current</Text></View>
                  <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Renewal</Text></View>
                  <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Alternate</Text></View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>Individual</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(tabs.medUHC.deductibles.individualCurrent)}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(tabs.medUHC.deductibles.individualRenewal)}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(tabs.medUHC.deductibles.individualAlternate)}</Text></View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>Family</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(tabs.medUHC.deductibles.familyCurrent)}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(tabs.medUHC.deductibles.familyRenewal)}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(tabs.medUHC.deductibles.familyAlternate)}</Text></View>
                </View>
              </View>
            </View>
          )}
        </Page>
      )}

      {/* Add more pages for other tabs as needed */}
    </Document>
  );
};

// Helper function to get tab label
const getTabLabel = (tabId) => {
  const tabLabels = {
    medUHC: 'Medical UHC',
    medUHC2: 'Medical UHC 2',
    medUHCTrustmark: 'Medical UHC Trustmark',
    dental: 'Dental',
    vision: 'Vision',
    gtl: 'Group Term Life',
    volLife: 'Voluntary Life',
    vltd: 'Voluntary Long Term Disability',
    cobra: 'COBRA',
  };
  return tabLabels[tabId] || tabId;
};

// Export function to generate PDF
export const generatePDF = async (booklet) => {
  try {
    const blob = await pdf(<BenefitsBookletPDF booklet={booklet} />).toBlob();
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Export function to download PDF
export const downloadPDF = async (booklet, filename = 'benefits-booklet.pdf') => {
  try {
    const blob = await generatePDF(booklet);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};

export default BenefitsBookletPDF;
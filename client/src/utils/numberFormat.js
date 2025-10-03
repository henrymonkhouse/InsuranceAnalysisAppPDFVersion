// Utility function to format numbers with commas for thousands
export const formatNumberWithCommas = (value) => {
  if (value === null || value === undefined || value === '') return '';
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) return '';
  
  // Format with commas and 2 decimal places
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Format currency values (adds $ symbol)
export const formatCurrency = (value) => {
  const formatted = formatNumberWithCommas(value);
  return formatted ? `$${formatted}` : '';
};

// Parse formatted number back to raw number (removes commas)
export const parseFormattedNumber = (value) => {
  if (typeof value !== 'string') return value;
  // Remove commas and dollar signs
  return parseFloat(value.replace(/[$,]/g, '')) || 0;
};
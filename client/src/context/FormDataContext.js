import React, { createContext, useState, useContext } from 'react';

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  // Store shared organization details
  const [sharedOrgDetails, setSharedOrgDetails] = useState({
    organizationName: '',
    effectiveDate: ''
  });

  // Store data for each tab
  const [tabsData, setTabsData] = useState({
    medUHC: {},
    medUHC2: {},
    medUHCTrustmark: {},
    dental: {},
    vision: {},
    gtl: {},
    volLife: {},
    vltd: {},
    cobra: {}
  });

  // Store which tabs have unsaved changes
  const [dirtyTabs, setDirtyTabs] = useState({});

  // Save data for a specific tab
  const saveTabData = (tabId, data, isDirty = true) => {
    // Only update if data has actually changed and is valid
    setTabsData(prev => {
      // Use deep comparison to prevent unnecessary updates
      const prevData = prev[tabId];
      if (prevData && JSON.stringify(prevData) === JSON.stringify(data)) {
        return prev; // No change, return previous state
      }
      
      // Data has changed, update it
      return {
        ...prev,
        [tabId]: data
      };
    });

    if (isDirty) {
      setDirtyTabs(prev => ({
        ...prev,
        [tabId]: true
      }));
    }
  };

  // Clear dirty flag for a tab
  const clearDirtyFlag = (tabId) => {
    setDirtyTabs(prev => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
  };

  // Check if any tab has unsaved changes
  const hasUnsavedChanges = () => {
    return Object.keys(dirtyTabs).length > 0;
  };

  // Update shared organization details
  const updateSharedOrgDetails = (details) => {
    setSharedOrgDetails(prev => ({
      ...prev,
      ...details
    }));
  };

  return (
    <FormDataContext.Provider value={{
      tabsData,
      dirtyTabs,
      sharedOrgDetails,
      saveTabData,
      clearDirtyFlag,
      hasUnsavedChanges,
      updateSharedOrgDetails
    }}>
      {children}
    </FormDataContext.Provider>
  );
};

// Custom hook to use the form data context
export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};

export default FormDataContext;
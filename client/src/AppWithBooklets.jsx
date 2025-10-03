import React, { useState, useRef, useEffect } from 'react';
import MedUHCTabWithColumns from './components/MedUHCTabWithColumns';
import MedUHC2TabWithColumns from './components/MedUHC2TabWithColumns';
import MedUHCTrustmarkTab from './components/MedUHCTrustmarkTab';
import SelfFunded from './components/SelfFunded';
import HomeScreen from './components/HomeScreen';
import TabSelector from './components/TabSelector';
import { BookletProvider, useBooklet } from './context/BookletContext';
import { generatePDFFromData } from './services/pdfService';
import { isElectron, getAppVersion } from './utils/electronUtils';

const AppContent = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'tabSelector', 'editor'
  const [activeTab, setActiveTab] = useState('medUHC');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // empty string, 'success', 'error'
  const [appVersion, setAppVersion] = useState('Web Version');

  const { 
    currentBooklet, 
    loadBooklet, 
    createBooklet, 
    updateBooklet,
    updateLocalTabData, 
    saveAllChanges, 
    clearBooklet,
    hasUnsavedChanges,
    tabHasData
  } = useBooklet();

  // Refs for tab components
  const medUHCTabRef = useRef(null);
  const medUHC2TabRef = useRef(null);
  const medUHCTrustmarkTabRef = useRef(null);
  const selfFundedTabRef = useRef(null);

  // Initialize app version if running in Electron
  useEffect(() => {
    const initAppVersion = async () => {
      if (isElectron()) {
        try {
          const version = await getAppVersion();
          setAppVersion(`v${version} (Desktop)`);
        } catch (error) {
          console.error('Error getting app version:', error);
        }
      }
    };
    initAppVersion();
  }, []);

  // Auto-select first tab when entering editor view
  useEffect(() => {
    if (currentView === 'editor' && currentBooklet?.metadata?.selectedTabs?.length > 0 && !activeTab) {
      setActiveTab(currentBooklet.metadata.selectedTabs[0]);
    }
  }, [currentView, currentBooklet, activeTab]);

  // Handle opening a booklet from home screen
  const handleOpenBooklet = async (bookletId) => {
    try {
      const booklet = await loadBooklet(bookletId);
      setCurrentView('editor');
      // Set the first selected tab as active immediately
      if (booklet?.metadata?.selectedTabs?.length > 0) {
        setActiveTab(booklet.metadata.selectedTabs[0]);
      }
    } catch (error) {
      console.error('Error opening booklet:', error);
    }
  };

  // Handle creating a new booklet
  const handleCreateBooklet = async (bookletData) => {
    try {
      const newBooklet = await createBooklet(bookletData);
      // Skip tab selector and go directly to editor since tabs are already selected in modal
      if (newBooklet?.metadata?.selectedTabs?.length > 0) {
        setActiveTab(newBooklet.metadata.selectedTabs[0]);
      }
      setCurrentView('editor');
    } catch (error) {
      console.error('Error creating booklet:', error);
    }
  };

  // Handle tab selection
  const handleTabsSelected = async (selectedTabs) => {
    if (!currentBooklet) return;
    
    try {
      await updateBooklet({
        selectedTabs: selectedTabs
      });
    } catch (error) {
      console.error('Error updating selected tabs:', error);
    }
  };

  // Handle continuing from tab selector to editor
  const handleContinueToEditor = () => {
    setCurrentView('editor');
    if (currentBooklet?.metadata.selectedTabs.length > 0) {
      setActiveTab(currentBooklet.metadata.selectedTabs[0]);
    }
  };

  // Handle going back to home
  const handleGoHome = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Do you want to save before leaving?')) {
        saveAllChanges().then(() => {
          clearBooklet();
          setCurrentView('home');
        });
      } else {
        clearBooklet();
        setCurrentView('home');
      }
    } else {
      clearBooklet();
      setCurrentView('home');
    }
  };

  // Handle saving all data
  const handleSaveToJSON = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('');

      // Collect data from all active tabs
      const tabRefs = {
        medUHC: medUHCTabRef,
        medUHC2: medUHC2TabRef,
        medUHCTrustmark: medUHCTrustmarkTabRef,
        selfFunded: selfFundedTabRef,
      };

      // Update local data for all tabs
      Object.entries(tabRefs).forEach(([tabId, ref]) => {
        if (ref.current && currentBooklet?.metadata.selectedTabs.includes(tabId)) {
          try {
            const rawData = ref.current.getFormData();
            updateLocalTabData(tabId, rawData);
          } catch (error) {
            console.error(`Error getting data from ${tabId} tab:`, error);
          }
        }
      });

      // Save all changes
      await saveAllChanges();

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving booklet data:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle PDF export
  const handleExportToPDF = async () => {
    if (!currentBooklet) return;

    try {
      setIsSaving(true);

      // First save any unsaved changes
      if (hasUnsavedChanges) {
        await handleSaveToJSON();
      }

      // Generate and download PDF using backend service
      await generatePDFFromData(currentBooklet);

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle tab switching
  const handleTabSwitch = (newTabId) => {
    if (activeTab === newTabId) return;

    // Save current tab data before switching
    const tabRefs = {
      medUHC: medUHCTabRef,
      medUHC2: medUHC2TabRef,
      medUHCTrustmark: medUHCTrustmarkTabRef,
      selfFunded: selfFundedTabRef,
    };

    const currentRef = tabRefs[activeTab];
    if (currentRef?.current) {
      try {
        const rawData = currentRef.current.getFormData();
        updateLocalTabData(activeTab, rawData);
      } catch (error) {
        console.error(`Error saving ${activeTab} tab data:`, error);
      }
    }

    setActiveTab(newTabId);
  };

  // Render based on current view
  if (currentView === 'home') {
    return (
      <HomeScreen 
        onOpenBooklet={handleOpenBooklet}
        onCreateBooklet={handleCreateBooklet}
      />
    );
  }

  if (currentView === 'tabSelector' && currentBooklet) {
    return (
      <TabSelector
        selectedTabs={currentBooklet.metadata.selectedTabs}
        onTabsSelected={handleTabsSelected}
        onContinue={handleContinueToEditor}
        bookletName={currentBooklet.metadata.name}
      />
    );
  }

  if (currentView === 'editor' && currentBooklet) {
    const selectedTabs = currentBooklet.metadata.selectedTabs;
    const tabs = [
      { id: 'medUHC', label: 'Fully Funded' },
      { id: 'selfFunded', label: 'Self Funded' }
    ].filter(tab => selectedTabs.includes(tab.id));

    return (
      <div className="min-h-screen bg-slate-50">
        {/* Enhanced Header/Navbar */}
        <header className="bg-gradient-to-r from-white to-gray-50 shadow-xl border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between py-8 px-6">
              <div className="flex items-center">
                <button
                  onClick={handleGoHome}
                  className="mr-6 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                  ← Back to Home
                </button>
                <div className="relative">
                  <img
                    src={process.env.PUBLIC_URL + "/images/Cornerstone-Logo.png"}
                    alt="Cornerstone Insurance Group Logo"
                    className="h-20 w-auto mr-8 transform hover:scale-105 transition-all duration-300 drop-shadow-lg"
                  />
                </div>
                <div className="border-l-2 border-indigo-200 pl-6">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none" style={{fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif'}}>
                    {currentBooklet.metadata.name}
                    <span className="block text-2xl font-semibold text-indigo-600 mt-1">
                      Benefits Editor
                    </span>
                  </h1>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                      <p className="text-gray-600 font-medium text-sm" style={{fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif'}}>
                        Editing booklet sections
                      </p>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                      {appVersion}
                    </span>
                    {hasUnsavedChanges && (
                      <span className="text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                        Unsaved changes
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {saveStatus === 'success' && (
                  <span className="text-green-600 inline-flex items-center bg-green-50 border border-green-200 px-3 py-1 rounded-full font-medium">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Saved successfully!
                  </span>
                )}

                {saveStatus === 'error' && (
                  <span className="text-red-600 inline-flex items-center bg-red-50 border border-red-200 px-3 py-1 rounded-full font-medium">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Error saving!
                  </span>
                )}

                <button
                  onClick={handleSaveToJSON}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-white font-medium flex items-center shadow-lg transform transition-all duration-200 bg-green-600 hover:bg-green-700 hover:scale-105 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>

                <button
                  onClick={handleExportToPDF}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-white font-medium flex items-center shadow-lg transform transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 disabled:opacity-50"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-indigo-800 text-white shadow-md">
          <div className="max-w-7xl mx-auto flex overflow-x-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`px-6 py-3 font-medium cursor-pointer transition whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-white text-indigo-800' : 'text-white/80 hover:text-white'
                } ${tabHasData(tab.id) ? 'relative after:content-["✓"] after:absolute after:top-1 after:right-1 after:text-green-400' : ''}`}
                onClick={() => handleTabSwitch(tab.id)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'medUHC' && selectedTabs.includes('medUHC') && (
            <MedUHCTabWithColumns
              ref={medUHCTabRef}
              initialData={{
                ...currentBooklet.data.tabs.medUHC,
                planDetails: {
                  ...currentBooklet.data.tabs.medUHC?.planDetails,
                  organizationName: currentBooklet.data.sharedDetails?.organizationName || '',
                  effectiveDate: currentBooklet.data.sharedDetails?.effectiveDate || ''
                }
              }}
              onDataChange={(data) => updateLocalTabData('medUHC', data)}
            />
          )}
          {activeTab === 'medUHC2' && selectedTabs.includes('medUHC2') && (
            <MedUHC2TabWithColumns
              ref={medUHC2TabRef}
              initialData={currentBooklet.data.tabs.medUHC2}
              onDataChange={(data) => updateLocalTabData('medUHC2', data)}
            />
          )}
          {activeTab === 'medUHCTrustmark' && selectedTabs.includes('medUHCTrustmark') && (
            <MedUHCTrustmarkTab
              ref={medUHCTrustmarkTabRef}
              initialData={currentBooklet.data.tabs.medUHCTrustmark}
              onDataChange={(data) => updateLocalTabData('medUHCTrustmark', data)}
            />
          )}
          {activeTab === 'selfFunded' && selectedTabs.includes('selfFunded') && (
            <SelfFunded
              ref={selfFundedTabRef}
              initialData={{
                ...currentBooklet.data.tabs.selfFunded,
                organizationName: currentBooklet.data.sharedDetails?.organizationName || '',
                effectiveDate: currentBooklet.data.sharedDetails?.effectiveDate || ''
              }}
              onDataChange={(data) => updateLocalTabData('selfFunded', data)}
            />
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

const AppWithBooklets = () => {
  return (
    <BookletProvider>
      <AppContent />
    </BookletProvider>
  );
};

export default AppWithBooklets;
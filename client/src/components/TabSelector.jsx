import React, { useState } from 'react';

const AVAILABLE_TABS = [
  { id: 'medUHC', label: 'Med UHC', description: 'Medical UHC Plan Details', icon: '🏥' },
  { id: 'medUHC2', label: 'Med UHC 2', description: 'Medical UHC Alternative Plan', icon: '🏥' },
  { id: 'medUHCTrustmark', label: 'Med UHC Trustmark', description: 'Medical UHC Trustmark Plan', icon: '🏥' },
  { id: 'selfFunded', label: 'Self Funded', description: 'Self Funded Analysis', icon: '📊' },
  // Future tabs - grayed out for now
  { id: 'std', label: 'STD', description: 'Short Term Disability', icon: '📋', disabled: true },
  { id: 'ltd', label: 'LTD', description: 'Long Term Disability', icon: '📄', disabled: true },
  { id: 'accident', label: 'Accident', description: 'Accident Insurance', icon: '🚑', disabled: true },
  { id: 'criticalIllness', label: 'Critical Illness', description: 'Critical Illness Coverage', icon: '❤️', disabled: true },
  { id: 'hospital', label: 'Hospital', description: 'Hospital Indemnity', icon: '🏨', disabled: true },
  { id: 'hsaFsa', label: 'HSA/FSA', description: 'Health Savings/Flexible Spending', icon: '💰', disabled: true },
];

const TabSelector = ({ selectedTabs = [], onTabsSelected, onContinue, bookletName }) => {
  const [selected, setSelected] = useState(new Set(selectedTabs));

  const toggleTab = (tabId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(tabId)) {
      newSelected.delete(tabId);
    } else {
      newSelected.add(tabId);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    const allEnabled = AVAILABLE_TABS.filter(tab => !tab.disabled).map(tab => tab.id);
    setSelected(new Set(allEnabled));
  };

  const selectNone = () => {
    setSelected(new Set());
  };

  const handleContinue = () => {
    onTabsSelected(Array.from(selected));
    onContinue();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Select Sections</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Choose which sections to include in your "{bookletName}" booklet
                </p>
              </div>
              <button
                onClick={handleContinue}
                disabled={selected.size === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue ({selected.size} selected)
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-4">
          <button
            onClick={selectAll}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Select All Available
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={selectNone}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Tabs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {AVAILABLE_TABS.map((tab) => (
            <div
              key={tab.id}
              className={`
                relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200
                ${tab.disabled 
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' 
                  : selected.has(tab.id)
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                }
              `}
              onClick={() => !tab.disabled && toggleTab(tab.id)}
            >
              {/* Selection indicator */}
              {!tab.disabled && (
                <div className="absolute top-4 right-4">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selected.has(tab.id) 
                      ? 'border-indigo-600 bg-indigo-600' 
                      : 'border-gray-300 bg-white'
                    }
                  `}>
                    {selected.has(tab.id) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* Tab content */}
              <div className="flex items-start">
                <span className="text-2xl mr-3">{tab.icon}</span>
                <div className="flex-1">
                  <h3 className={`text-lg font-medium ${tab.disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                    {tab.label}
                  </h3>
                  <p className={`mt-1 text-sm ${tab.disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tab.description}
                  </p>
                  {tab.disabled && (
                    <span className="mt-2 inline-block text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabSelector;
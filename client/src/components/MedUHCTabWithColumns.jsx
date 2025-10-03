// MedUHC Tab with ColumnManager integration - keeping all existing functionality
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { formatNumberWithCommas } from '../utils/numberFormat';
import ColumnManager from './shared/ColumnManager';

// Constants for reusable CSS classes
const CSS_CLASSES = {
  inputCell: "p-2 bg-white border border-slate-200",
  disabledCell: "p-2 bg-slate-100 border border-slate-200",
  dollarIcon: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400",
  numberInput: "block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center",
  disabledInput: "bg-slate-100 block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center",
  dropdown: "block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
};

// Constants for dropdown options
const TYPE_OPTIONS = [
  { value: '', label: 'Select type' },
  { value: 'Copay', label: 'Copay' },
  { value: 'Deductible', label: 'Deductible' },
  { value: 'Copay + Deductible', label: 'Copay + Deductible' }
];

const MedUHCTabWithColumns = forwardRef(({ initialData = null, onDataChange = () => {} }, ref) => {

  // Column state management - initialize with base columns
  const [columns, setColumns] = useState([
    { id: 'current', label: 'Current', type: 'base', isMarketing: false },
    { id: 'renewal', label: 'Renewal', type: 'base', isMarketing: false }
  ]);

  // State management for plan details - keeping exact same structure but making column data dynamic
  const [planDetails, setPlanDetails] = useState({
    organizationName: "",
    effectiveDate: "",
    // Dynamic column data
    plans: {}, // { columnId: planName }
    networks: {}, // { columnId: networkName }  
    overviews: {} // { columnId: overview }
  });

  // Calendar state (keeping original)
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  // All other state - convert to dynamic column structure
  const [deductibles, setDeductibles] = useState({
    individual: {}, // { columnId: value }
    family: {} // { columnId: value }
  });

  const [outOfPocket, setOutOfPocket] = useState({
    individual: {}, // { columnId: value }
    family: {} // { columnId: value }
  });

  const [coinsuranceValues, setCoinsuranceValues] = useState({
    regular: {}, // { columnId: value }
    routine: {} // { columnId: value }
  });

  const [primaryCare, setPrimaryCare] = useState({
    amount: {}, // { columnId: value }
    text: {} // { columnId: value }
  });

  const [specialist, setSpecialist] = useState({
    amount: {}, // { columnId: value }
    type: {} // { columnId: value }
  });

  const [inpatientHospitalization, setInpatientHospitalization] = useState({
    amount: {}, // { columnId: value }
    type: {} // { columnId: value }
  });

  const [outpatientSurgery, setOutpatientSurgery] = useState({
    amount: {}, // { columnId: value }
    type: {} // { columnId: value }
  });

  const [emergencyRoom, setEmergencyRoom] = useState({
    amount: {}, // { columnId: value }
    type: {} // { columnId: value }
  });

  const [urgentCare, setUrgentCare] = useState({
    amount: {}, // { columnId: value }
    type: {} // { columnId: value }
  });

  const [retailPrescription, setRetailPrescription] = useState({
    tier1: {}, // { columnId: value }
    tier2: {}, // { columnId: value }
    tier3: {}, // { columnId: value }
    tier4: {} // { columnId: value }
  });

  const [financialSummary, setFinancialSummary] = useState({
    employeeCount: '',
    employeeSpouseCount: '',
    employeeChildrenCount: '',
    familyCount: '',
    employeeRate: {}, // { columnId: value }
    employeeSpouseRate: {}, // { columnId: value }
    employeeChildrenRate: {}, // { columnId: value }
    familyRate: {} // { columnId: value }
  });

  const [calculatedTotals, setCalculatedTotals] = useState({
    monthlyTotals: {}, // { columnId: value }
    annualPremiums: {}, // { columnId: value }
    dollarDifferences: {}, // { columnId: value }
    percentDifferences: {} // { columnId: value }
  });

  // Handle column changes
  const handleColumnsChange = (newColumns) => {
    setColumns(newColumns);
    
    // Clean up data for removed columns
    const columnIds = newColumns.map(col => col.id);
    const cleanData = (dataObj) => Object.fromEntries(
      Object.entries(dataObj).filter(([colId]) => columnIds.includes(colId))
    );

    // Clean all dynamic data structures
    setPlanDetails(prev => ({
      ...prev,
      plans: cleanData(prev.plans),
      networks: cleanData(prev.networks),
      overviews: cleanData(prev.overviews)
    }));

    setDeductibles(prev => ({
      individual: cleanData(prev.individual),
      family: cleanData(prev.family)
    }));

    // Clean other structures...
    setOutOfPocket(prev => ({
      individual: cleanData(prev.individual),
      family: cleanData(prev.family)
    }));

    setCoinsuranceValues(prev => ({
      regular: cleanData(prev.regular),
      routine: cleanData(prev.routine)
    }));

    setPrimaryCare(prev => ({
      amount: cleanData(prev.amount),
      text: cleanData(prev.text)
    }));

    setSpecialist(prev => ({
      amount: cleanData(prev.amount),
      type: cleanData(prev.type)
    }));

    setInpatientHospitalization(prev => ({
      amount: cleanData(prev.amount),
      type: cleanData(prev.type)
    }));

    setOutpatientSurgery(prev => ({
      amount: cleanData(prev.amount),
      type: cleanData(prev.type)
    }));

    setEmergencyRoom(prev => ({
      amount: cleanData(prev.amount),
      type: cleanData(prev.type)
    }));

    setUrgentCare(prev => ({
      amount: cleanData(prev.amount),
      type: cleanData(prev.type)
    }));

    setRetailPrescription(prev => ({
      tier1: cleanData(prev.tier1),
      tier2: cleanData(prev.tier2),
      tier3: cleanData(prev.tier3),
      tier4: cleanData(prev.tier4)
    }));

    setFinancialSummary(prev => ({
      ...prev,
      employeeRate: cleanData(prev.employeeRate),
      employeeSpouseRate: cleanData(prev.employeeSpouseRate),
      employeeChildrenRate: cleanData(prev.employeeChildrenRate),
      familyRate: cleanData(prev.familyRate)
    }));

    setCalculatedTotals(prev => ({
      monthlyTotals: cleanData(prev.monthlyTotals),
      annualPremiums: cleanData(prev.annualPremiums),
      dollarDifferences: cleanData(prev.dollarDifferences),
      percentDifferences: cleanData(prev.percentDifferences)
    }));
  };

  // Helper function to get column data
  const getColumnData = (dataObj, columnId, fallback = '') => {
    return dataObj[columnId] || fallback;
  };

  // Helper function to set column data
  const setColumnData = (setter, section, columnId, value) => {
    setter(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [columnId]: value
      }
    }));
  };

  // Text input handler - now handles dynamic columns
  const handleTextInputChange = (field, value, columnId = null) => {
    if (field === 'organizationName' || field === 'effectiveDate') {
      setPlanDetails(prev => ({ ...prev, [field]: value }));
    } else if (columnId) {
      // Handle dynamic column data
      if (field.includes('Plan') || field === 'plan') {
        setColumnData(setPlanDetails, 'plans', columnId, value);
      } else if (field.includes('Network') || field === 'network') {
        setColumnData(setPlanDetails, 'networks', columnId, value);
      } else if (field.includes('Overview') || field === 'overview') {
        setColumnData(setPlanDetails, 'overviews', columnId, value);
      }
    }
  };

  // Apply initial data if available
  useEffect(() => {
    if (initialData) {
      // Load existing data structure
      if (initialData.planDetails) {
        setPlanDetails(prev => ({
          ...prev,
          organizationName: initialData.planDetails.organizationName || "",
          effectiveDate: initialData.planDetails.effectiveDate || "",
          plans: initialData.planDetails.plans || {},
          networks: initialData.planDetails.networks || {},
          overviews: initialData.planDetails.overviews || {}
        }));
      }
      
      // Load column configuration
      if (initialData.columns) {
        setColumns(initialData.columns);
      }
      
      // Load other data structures...
      if (initialData.deductibles) setDeductibles(initialData.deductibles);
      if (initialData.outOfPocket) setOutOfPocket(initialData.outOfPocket);
      // Continue for all state...
    }
  }, [initialData]);

  // Organization details are managed locally in this component

  // Calculate totals whenever financial summary changes (keeping original logic)
  useEffect(() => {
    const parseValue = (value) => {
      if (value === '' || isNaN(Number(value))) return 0;
      return Number(value);
    };

    const newTotals = { monthlyTotals: {}, annualPremiums: {}, dollarDifferences: {}, percentDifferences: {} };
    const baseColumnId = columns.find(col => col.id === 'current')?.id;

    columns.forEach(column => {
      const employeeTotal = parseValue(financialSummary.employeeCount) * parseValue(financialSummary.employeeRate[column.id] || 0);
      const spouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRate[column.id] || 0);
      const childrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRate[column.id] || 0);
      const familyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRate[column.id] || 0);

      const monthlyTotal = employeeTotal + spouseTotal + childrenTotal + familyTotal;
      const annualPremium = monthlyTotal * 12;

      newTotals.monthlyTotals[column.id] = monthlyTotal;
      newTotals.annualPremiums[column.id] = annualPremium;

      // Calculate differences from base column
      if (baseColumnId && column.id !== baseColumnId) {
        const basePremium = newTotals.annualPremiums[baseColumnId] || 0;
        const dollarDiff = annualPremium - basePremium;
        const percentDiff = basePremium > 0 ? (dollarDiff / basePremium) * 100 : 0;

        newTotals.dollarDifferences[column.id] = dollarDiff;
        newTotals.percentDifferences[column.id] = percentDiff;
      }
    });

    setCalculatedTotals(newTotals);
  }, [financialSummary, columns]);

  // Notify parent of data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = {
        planDetails,
        deductibles,
        outOfPocket,
        coinsuranceValues,
        primaryCare,
        specialist,
        inpatientHospitalization,
        outpatientSurgery,
        emergencyRoom,
        urgentCare,
        retailPrescription,
        financialSummary,
        calculatedTotals,
        columns
      };
      onDataChange(data);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    planDetails, deductibles, outOfPocket, coinsuranceValues,
    primaryCare, specialist, inpatientHospitalization,
    outpatientSurgery, emergencyRoom, urgentCare, retailPrescription,
    financialSummary, calculatedTotals, columns, onDataChange
  ]);

  // Expose methods to parent (keeping original interface)
  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      planDetails,
      deductibles,
      outOfPocket,
      coinsuranceValues,
      primaryCare,
      specialist,
      inpatientHospitalization,
      outpatientSurgery,
      emergencyRoom,
      urgentCare,
      retailPrescription,
      financialSummary,
      calculatedTotals,
      columns
    }),
    getFormattedData: () => ({
      planDetails,
      deductibles,
      outOfPocket,
      coinsuranceValues,
      primaryCare,
      specialist,
      inpatientHospitalization,
      outpatientSurgery,
      emergencyRoom,
      urgentCare,
      retailPrescription,
      financialSummary,
      calculatedTotals,
      columns
    })
  }));

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">

      {/* Main content with custom column management */}
      <div className={`mx-auto w-full px-4 py-4 ${columns.length >= 4 ? 'overflow-x-auto' : 'max-w-7xl'}`}
           style={columns.length >= 4 ? { minWidth: '1200px' } : {}}>

        {/* Organization Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
              HR
            </div>
            <div>
              <input
                type="text"
                value={planDetails.organizationName}
                onChange={e => handleTextInputChange('organizationName', e.target.value)}
                className="text-2xl font-bold text-indigo-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
                placeholder="Organization Name"
              />
              <p className="text-sm text-gray-600">Medical Plan Comparison</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Effective:</span>
            <input
              type="text"
              value={planDetails.effectiveDate}
              onChange={e => handleTextInputChange('effectiveDate', e.target.value)}
              className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
              placeholder="Effective Date"
            />
          </div>
        </div>

        {/* Content Area */}
        <div>

          {/* Plan Headers - Dynamic */}
          <div className="grid gap-4 mb-2" style={{
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4
              ? `320px repeat(${columns.length}, 1fr)`
              : `320px repeat(${columns.length}, 1fr) 60px`
          }}>
            <div></div>
            {columns.map(column => (
              <div key={column.id} className={`p-3 rounded-t-lg font-medium text-center ${
                column.type === 'base'
                  ? 'bg-indigo-700 text-white'
                  : column.isMarketing
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-white'
              }`}>
                {column.type === 'base' ? (
                  <input
                    type="text"
                    value={column.label}
                    onChange={(e) => {
                      setColumns(prev => prev.map(col =>
                        col.id === column.id
                          ? { ...col, label: e.target.value }
                          : col
                      ));
                    }}
                    className="w-full bg-transparent border-none text-center font-semibold focus:outline-none focus:ring-1 focus:ring-white rounded px-1 text-sm mb-1"
                  />
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={column.label}
                          onChange={(e) => {
                            setColumns(prev => prev.map(col =>
                              col.id === column.id
                                ? { ...col, label: e.target.value }
                                : col
                            ));
                          }}
                          className="w-full bg-transparent border-none text-center font-semibold focus:outline-none focus:ring-1 focus:ring-white rounded px-1 text-sm mb-1"
                        />
                      </div>
                      <button
                        onClick={() => setColumns(prev => prev.filter(col => col.id !== column.id))}
                        className="ml-2 text-white hover:text-red-200 text-sm"
                        title="Remove Column"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex items-center justify-center">
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={column.isMarketing}
                          onChange={() => {
                            setColumns(prev => prev.map(col =>
                              col.id === column.id
                                ? { ...col, isMarketing: !col.isMarketing }
                                : col
                            ));
                          }}
                          className="mr-1 rounded border-gray-300 text-white focus:ring-white"
                        />
                        <span className="text-white font-medium">Marketing</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div className="flex items-end justify-center">
                <button
                  onClick={() => {
                    const alternateCount = columns.filter(col => col.type === 'alternate').length;
                    const newColumn = {
                      id: `alternate${alternateCount + 1}`,
                      label: `Alternate ${alternateCount + 1}`,
                      type: 'alternate',
                      isMarketing: false
                    };
                    setColumns(prev => [...prev, newColumn]);
                  }}
                  className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  title="Add Column"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Network Row - Dynamic */}
          <div className="grid gap-4 mt-2" style={{
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4
              ? `320px repeat(${columns.length}, 1fr)`
              : `320px repeat(${columns.length}, 1fr) 60px`
          }}>
            <div className="bg-indigo-700 text-white p-2 font-medium">NETWORK</div>
            {columns.map(column => (
              <div key={column.id} className="bg-indigo-100 text-indigo-800 p-2 text-center">
                <input
                  type="text"
                  className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
                  value={getColumnData(planDetails.networks, column.id)}
                  onChange={(e) => handleTextInputChange('network', e.target.value, column.id)}
                  placeholder="Insert Network Name"
                />
              </div>
            ))}
            {columns.filter(col => col.type === 'alternate').length < 4 && <div></div>}
          </div>

          {/* Medical Plan Overview - Dynamic */}
          <div className="grid gap-4 mt-2" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="bg-indigo-700 text-white p-2 font-medium">MEDICAL PLAN OVERVIEW</div>
            {columns.map(column => (
              <div key={column.id} className="bg-indigo-100 text-indigo-800 p-2 text-center">
                <input
                  type="text"
                  className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
                  value={getColumnData(planDetails.overviews, column.id)}
                  onChange={(e) => handleTextInputChange('overview', e.target.value, column.id)}
                  placeholder="In Network Benefits"
                />
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Annual Deductible Section */}
          <div className="grid gap-4 mt-2" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="bg-sky-600 text-white p-2 font-medium">ANNUAL DEDUCTIBLE</div>
            {columns.map((col) => <div key={`spacer-deductible-${col.id}`}></div>)}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Individual Deductible Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">Individual</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(deductibles.individual, column.id)}
                    onChange={(e) => setColumnData(setDeductibles, 'individual', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Family Deductible Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Family</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(deductibles.family, column.id)}
                    onChange={(e) => setColumnData(setDeductibles, 'family', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Out of Pocket Maximum Section */}
          <div className="grid gap-4 mt-2" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="bg-sky-600 text-white p-2 font-medium">ANNUAL MAXIMUM OUT OF POCKET</div>
            {columns.map((col) => <div key={`spacer-oop-${col.id}`}></div>)}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Individual Out of Pocket Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">Individual</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(outOfPocket.individual, column.id)}
                    onChange={(e) => setColumnData(setOutOfPocket, 'individual', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Family Out of Pocket Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Family</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(outOfPocket.family, column.id)}
                    onChange={(e) => setColumnData(setOutOfPocket, 'family', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Coinsurance Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Coinsurance</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <input
                  type="text"
                  className="w-full text-center border border-slate-200 rounded py-1 focus:ring-2 focus:ring-indigo-500"
                  value={getColumnData(coinsuranceValues.regular, column.id)}
                  onChange={(e) => setColumnData(setCoinsuranceValues, 'regular', column.id, e.target.value)}
                  placeholder="80%"
                />
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Physician Visits Section */}
          <div className="grid gap-4 mt-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="bg-green-600 text-white p-2 font-medium">PHYSICIAN VISITS</div>
            {columns.map((col) => <div key={`spacer-physician-${col.id}`}></div>)}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Routine Preventative Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">Routine Preventative</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-sm text-gray-600">Covered at</span>
                  <input
                    type="number"
                    className="w-20 text-center border border-slate-200 rounded py-1 focus:ring-2 focus:ring-indigo-500"
                    value={getColumnData(coinsuranceValues.routine, column.id)}
                    onChange={(e) => setColumnData(setCoinsuranceValues, 'routine', column.id, e.target.value)}
                    placeholder="100"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Primary Care Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Primary Care</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <input
                  type="text"
                  className="w-full text-center border border-slate-200 rounded py-1 focus:ring-2 focus:ring-indigo-500"
                  value={getColumnData(primaryCare.text, column.id)}
                  onChange={(e) => setColumnData(setPrimaryCare, 'text', column.id, e.target.value)}
                  placeholder=""
                />
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Specialist Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Specialist</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="flex space-x-1">
                  <div className="relative w-24">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                    <input
                      type="number"
                      className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                      value={getColumnData(specialist.amount, column.id)}
                      onChange={(e) => setColumnData(setSpecialist, 'amount', column.id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <select
                    className="flex-1 text-center border border-slate-200 rounded py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={getColumnData(specialist.type, column.id)}
                    onChange={(e) => setColumnData(setSpecialist, 'type', column.id, e.target.value)}
                  >
                    {TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Hospital Services Section */}
          <div className="grid gap-4 mt-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="bg-red-600 text-white p-2 font-medium">HOSPITAL SERVICES</div>
            {columns.map((col) => <div key={`spacer-hospital-${col.id}`}></div>)}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Inpatient Hospitalization Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">Inpatient Hospitalization</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="flex space-x-1">
                  <div className="relative w-24">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                    <input
                      type="number"
                      className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                      value={getColumnData(inpatientHospitalization.amount, column.id)}
                      onChange={(e) => setColumnData(setInpatientHospitalization, 'amount', column.id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <select
                    className="flex-1 text-center border border-slate-200 rounded py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={getColumnData(inpatientHospitalization.type, column.id)}
                    onChange={(e) => setColumnData(setInpatientHospitalization, 'type', column.id, e.target.value)}
                  >
                    {TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Outpatient Surgery Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Outpatient Surgery</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="flex space-x-1">
                  <div className="relative w-24">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                    <input
                      type="number"
                      className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                      value={getColumnData(outpatientSurgery.amount, column.id)}
                      onChange={(e) => setColumnData(setOutpatientSurgery, 'amount', column.id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <select
                    className="flex-1 text-center border border-slate-200 rounded py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={getColumnData(outpatientSurgery.type, column.id)}
                    onChange={(e) => setColumnData(setOutpatientSurgery, 'type', column.id, e.target.value)}
                  >
                    {TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Emergency Room Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Emergency Room</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="flex space-x-1">
                  <div className="relative w-24">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                    <input
                      type="number"
                      className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                      value={getColumnData(emergencyRoom.amount, column.id)}
                      onChange={(e) => setColumnData(setEmergencyRoom, 'amount', column.id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <select
                    className="flex-1 text-center border border-slate-200 rounded py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={getColumnData(emergencyRoom.type, column.id)}
                    onChange={(e) => setColumnData(setEmergencyRoom, 'type', column.id, e.target.value)}
                  >
                    {TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Urgent Care Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Urgent Care</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="flex space-x-1">
                  <div className="relative w-24">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                    <input
                      type="number"
                      className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                      value={getColumnData(urgentCare.amount, column.id)}
                      onChange={(e) => setColumnData(setUrgentCare, 'amount', column.id, e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <select
                    className="flex-1 text-center border border-slate-200 rounded py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={getColumnData(urgentCare.type, column.id)}
                    onChange={(e) => setColumnData(setUrgentCare, 'type', column.id, e.target.value)}
                  >
                    {TYPE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Prescription Drug Benefit Section */}
          <div className="grid gap-4 mt-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="bg-purple-600 text-white p-2 font-medium">PRESCRIPTION DRUG BENEFIT</div>
            {columns.map((col) => <div key={`spacer-prescription-${col.id}`}></div>)}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Retail Prescription Header */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-purple-100 border-l border-b border-t border-slate-200 font-medium text-purple-800">Retail</div>
            {columns.map((col) => <div key={`spacer-retail-${col.id}`} className="bg-purple-100 border border-slate-200"></div>)}
          </div>

          {/* Tier 1 Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-8 p-2 bg-white border-l border-b border-slate-200 font-medium">Tier 1 (Generic)</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(retailPrescription.tier1, column.id)}
                    onChange={(e) => setColumnData(setRetailPrescription, 'tier1', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Tier 2 Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-8 p-2 bg-white border-l border-b border-slate-200 font-medium">Tier 2 (Preferred Brand)</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(retailPrescription.tier2, column.id)}
                    onChange={(e) => setColumnData(setRetailPrescription, 'tier2', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Tier 3 Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-8 p-2 bg-white border-l border-b border-slate-200 font-medium">Tier 3 (Non-Preferred Brand)</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(retailPrescription.tier3, column.id)}
                    onChange={(e) => setColumnData(setRetailPrescription, 'tier3', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Tier 4 Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-8 p-2 bg-white border-l border-b border-slate-200 font-medium">Tier 4 (Specialty)</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(retailPrescription.tier4, column.id)}
                    onChange={(e) => setColumnData(setRetailPrescription, 'tier4', column.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Financial Summary Section */}
          <div className="grid gap-4 mt-6" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="bg-indigo-700 text-white p-2 font-medium">FINANCIAL SUMMARY</div>
            {columns.map(column => (
              <div key={column.id} className="text-center bg-indigo-100 p-2 text-indigo-800 font-medium">
                {column.label} Rates
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Employee Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium flex justify-between">
              <span>Employee</span>
              <div className="text-indigo-600 font-medium">
                <input
                  type="number"
                  className="w-12 text-center border border-slate-200 rounded px-1"
                  value={financialSummary.employeeCount}
                  onChange={(e) => setFinancialSummary(prev => ({...prev, employeeCount: e.target.value}))}
                  placeholder="0"
                />
              </div>
            </div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(financialSummary.employeeRate, column.id)}
                    onChange={(e) => setColumnData(setFinancialSummary, 'employeeRate', column.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Employee + Spouse Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
              <span>Employee + Spouse</span>
              <div className="text-indigo-600 font-medium">
                <input
                  type="number"
                  className="w-12 text-center border border-slate-200 rounded px-1"
                  value={financialSummary.employeeSpouseCount}
                  onChange={(e) => setFinancialSummary(prev => ({...prev, employeeSpouseCount: e.target.value}))}
                  placeholder="0"
                />
              </div>
            </div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(financialSummary.employeeSpouseRate, column.id)}
                    onChange={(e) => setColumnData(setFinancialSummary, 'employeeSpouseRate', column.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Employee + Children Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
              <span>Employee + Children</span>
              <div className="text-indigo-600 font-medium">
                <input
                  type="number"
                  className="w-12 text-center border border-slate-200 rounded px-1"
                  value={financialSummary.employeeChildrenCount}
                  onChange={(e) => setFinancialSummary(prev => ({...prev, employeeChildrenCount: e.target.value}))}
                  placeholder="0"
                />
              </div>
            </div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(financialSummary.employeeChildrenRate, column.id)}
                    onChange={(e) => setColumnData(setFinancialSummary, 'employeeChildrenRate', column.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Family Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
              <span>Family</span>
              <div className="text-indigo-600 font-medium">
                <input
                  type="number"
                  className="w-12 text-center border border-slate-200 rounded px-1"
                  value={financialSummary.familyCount}
                  onChange={(e) => setFinancialSummary(prev => ({...prev, familyCount: e.target.value}))}
                  placeholder="0"
                />
              </div>
            </div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={getColumnData(financialSummary.familyRate, column.id)}
                    onChange={(e) => setColumnData(setFinancialSummary, 'familyRate', column.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Totals Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium">Totals</div>
            {columns.map(column => (
              <div key={column.id} className="p-2 bg-slate-100 border border-slate-200">
                <div className="text-center font-medium text-slate-900">
                  ${formatNumberWithCommas(calculatedTotals.monthlyTotals?.[column.id] || 0)}
                </div>
              </div>
            ))}
            {/* Empty spacer for plus button alignment */}
            {columns.filter(col => col.type === 'alternate').length < 4 && (
              <div></div>
            )}
          </div>

          {/* Total Annual Difference Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium text-slate-800">Total Annual Diff</div>
            {columns.map(column => {
              const dollarDiff = calculatedTotals.dollarDifferences?.[column.id] || 0;
              const isPositive = dollarDiff > 0;
              const isNegative = dollarDiff < 0;
              const isZero = dollarDiff === 0;
              
              return (
                <div key={column.id} className={`p-2 border border-slate-200 ${
                  column.id === 'current' 
                    ? 'bg-slate-100' 
                    : isNegative 
                      ? 'bg-green-100' 
                      : isPositive 
                        ? 'bg-red-100' 
                        : 'bg-slate-100'
                }`}>
                  <div className={`text-center font-medium ${
                    column.id === 'current' 
                      ? 'text-slate-800' 
                      : isNegative 
                        ? 'text-green-800' 
                        : isPositive 
                          ? 'text-red-800' 
                          : 'text-slate-800'
                  }`}>
                    {column.id === 'current' ? '-' : 
                      `$${formatNumberWithCommas(Math.abs(dollarDiff))}`
                    }
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total % Difference Row */}
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: columns.filter(col => col.type === 'alternate').length >= 4 
              ? `320px repeat(${columns.length}, 1fr)` 
              : `320px repeat(${columns.length}, 1fr) 60px` 
          }}>
            <div className="pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium text-slate-800">Total % Diff</div>
            {columns.map(column => {
              const percentDiff = calculatedTotals.percentDifferences?.[column.id] || 0;
              const isPositive = percentDiff > 0;
              const isNegative = percentDiff < 0;
              const isZero = percentDiff === 0;
              
              return (
                <div key={column.id} className={`p-2 border border-slate-200 ${
                  column.id === 'current' 
                    ? 'bg-slate-100' 
                    : isNegative 
                      ? 'bg-green-100' 
                      : isPositive 
                        ? 'bg-red-100' 
                        : 'bg-slate-100'
                }`}>
                  <div className={`text-center font-medium ${
                    column.id === 'current' 
                      ? 'text-slate-800' 
                      : isNegative 
                        ? 'text-green-800' 
                        : isPositive 
                          ? 'text-red-800' 
                          : 'text-slate-800'
                  }`}>
                    {column.id === 'current' ? '-' : 
                      `${Math.abs(percentDiff).toFixed(1)}%`
                    }
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
});

MedUHCTabWithColumns.displayName = 'MedUHCTabWithColumns';

export default MedUHCTabWithColumns;
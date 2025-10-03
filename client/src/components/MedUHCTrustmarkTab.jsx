// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFormData } from '../context/FormDataContext';
import { formatNumberWithCommas } from '../utils/numberFormat';

// Constants for reusable CSS classes
const CSS_CLASSES = {
  inputCell: "col-span-1 p-2 bg-white border border-slate-200",
  disabledCell: "col-span-1 p-2 bg-slate-100 border border-slate-200",
  dollarIcon: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400",
  numberInput: "block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center",
  disabledInput: "bg-slate-100 block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center",
  dropdown: "mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
};

// Constants for dropdown options
const TYPE_OPTIONS = [
  { value: '', label: 'Select type' },
  { value: 'Copay', label: 'Copay' },
  { value: 'Deductible', label: 'Deductible' },
  { value: 'Copay + Deductible', label: 'Copay + Deductible' }
];

const MedUHCTrustmarkTab = forwardRef(({ initialData = null, onDataChange = () => {} }, ref) => {
  // Access shared organization details from context
  const { sharedOrgDetails, updateSharedOrgDetails } = useFormData();
  

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  // Apply initial data if available
  useEffect(() => {
    if (initialData) {
      // Set all the state from the persisted data, merging with current state to avoid undefined values
      if (initialData.planDetails) {
        setPlanDetails(prev => ({ 
          ...prev, 
          ...initialData.planDetails,
          // Preserve shared org details if they exist
          organizationName: sharedOrgDetails.organizationName || initialData.planDetails.organizationName || "",
          effectiveDate: sharedOrgDetails.effectiveDate || initialData.planDetails.effectiveDate || ""
        }));
      }
      if (initialData.deductibles) {
        setDeductibles(prev => ({ ...prev, ...initialData.deductibles }));
      }
      if (initialData.outOfPocket) {
        setOutOfPocket(prev => ({ ...prev, ...initialData.outOfPocket }));
      }
      if (initialData.coinsuranceValues) {
        setCoinsuranceValues(prev => ({ ...prev, ...initialData.coinsuranceValues }));
      }
      if (initialData.routinePreventive) {
        setRoutinePreventive(prev => ({ ...prev, ...initialData.routinePreventive }));
      }
      if (initialData.primaryCare) {
        setPrimaryCare(prev => ({ ...prev, ...initialData.primaryCare }));
      }
      if (initialData.specialist) {
        setSpecialist(prev => ({ ...prev, ...initialData.specialist }));
      }
      if (initialData.inpatientHospitalization) {
        setInpatientHospitalization(prev => ({ ...prev, ...initialData.inpatientHospitalization }));
      }
      if (initialData.outpatientSurgery) {
        setOutpatientSurgery(prev => ({ ...prev, ...initialData.outpatientSurgery }));
      }
      if (initialData.emergencyRoom) {
        setEmergencyRoom(prev => ({ ...prev, ...initialData.emergencyRoom }));
      }
      if (initialData.urgentCare) {
        setUrgentCare(prev => ({ ...prev, ...initialData.urgentCare }));
      }
      if (initialData.retailPrescription) {
        setRetailPrescription(prev => ({ ...prev, ...initialData.retailPrescription }));
      }
      if (initialData.financialSummary) {
        setFinancialSummary(prev => ({ ...prev, ...initialData.financialSummary }));
      }
      if (initialData.footerNote !== undefined) {
        setFooterNote(initialData.footerNote);
      }
      if (initialData.calculatedTotals) {
        setCalculatedTotals(prev => ({ ...prev, ...initialData.calculatedTotals }));
      }
    }
  }, [initialData, sharedOrgDetails]);
  
  // State management for all editable values
  const [planDetails, setPlanDetails] = useState({
    organizationName: "",
    effectiveDate: "",
    description: "",
    currentPlan: "",
    renewalPlan: "",
    alternatePlan: "",
    currentNetwork: "",
    renewalNetwork: "",
    alternateNetwork: "",
    currentPlanOverview: "",
    renewalPlanOverview: "",
    alternatePlanOverview: ""
  });

  // Deductible values
  const [deductibles, setDeductibles] = useState({
    individualCurrent: '',
    individualRenewal: '',
    individualAlternate: '',
    familyCurrent: '',
    familyRenewal: '',
    familyAlternate: ''
  });

  // Out of pocket values
  const [outOfPocket, setOutOfPocket] = useState({
    individualCurrent: '',
    individualRenewal: '',
    individualAlternate: '',
    familyCurrent: '',
    familyRenewal: '',
    familyAlternate: ''
  });

  // Coinsurance values
  const [coinsuranceValues, setCoinsuranceValues] = useState({
    current: '',
    renewal: '',
    alternate: ''
  });

  // Routine Preventive Care values
  const [routinePreventive, setRoutinePreventive] = useState({
    currentValue: "",
    renewalValue: "",
    alternateValue: ""
  });

  // Primary care values
  const [primaryCare, setPrimaryCare] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    currentText: "",
    renewalText: "",
    alternateText: ""
  });

  // Specialist values
  const [specialist, setSpecialist] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: ""
  });

  // Inpatient Hospitalization values
  const [inpatientHospitalization, setInpatientHospitalization] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: ""
  });

  // Outpatient Surgery values
  const [outpatientSurgery, setOutpatientSurgery] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: ""
  });

  // Emergency room values
  const [emergencyRoom, setEmergencyRoom] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: ""
  });

  // Urgent care values
  const [urgentCare, setUrgentCare] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: ""
  });

  // Retail prescription values
  const [retailPrescription, setRetailPrescription] = useState({
    current: {
      tier1: '',
      tier2: '',
      tier3: '',
      tier4: ''
    },
    renewal: {
      tier1: '',
      tier2: '',
      tier3: '',
      tier4: ''
    },
    alternate: {
      tier1: '',
      tier2: '',
      tier3: '',
      tier4: '',
      specialNote: ''
    }
  });

  // Financial summary values
  const [financialSummary, setFinancialSummary] = useState({
    employeeCount: '',
    employeeSpouseCount: '',
    employeeChildrenCount: '',
    familyCount: '',
    employeeRateCurrent: '',
    employeeRateRenewal: '',
    employeeRateAlternate: '',
    employeeSpouseRateCurrent: '',
    employeeSpouseRateRenewal: '',
    employeeSpouseRateAlternate: '',
    employeeChildrenRateCurrent: '',
    employeeChildrenRateRenewal: '',
    employeeChildrenRateAlternate: '',
    familyRateCurrent: '',
    familyRateRenewal: '',
    familyRateAlternate: '',
    renewalRateIncrease: '',
    alternateRateReduction: ''
  });

  // Footer note
  const [footerNote, setFooterNote] = useState("");

  // Calculated total values
  const [calculatedTotals, setCalculatedTotals] = useState({
    currentTotal: 0,
    renewalTotal: 0,
    alternateTotal: 0,
    currentAnnualPremium: 0,
    renewalAnnualPremium: 0,
    alternateAnnualPremium: 0,
    annualDollarDiffRenewal: 0,
    annualDollarDiffAlternate: 0,
    annualPercentDiffRenewal: 0,
    annualPercentDiffAlternate: 0
  });
  
  // Sync with shared organization details
  useEffect(() => {
    setPlanDetails(prev => ({
      ...prev,
      organizationName: sharedOrgDetails.organizationName || prev.organizationName,
      effectiveDate: sharedOrgDetails.effectiveDate || prev.effectiveDate
    }));
  }, [sharedOrgDetails]);

  // Make the component's methods available to parent via ref
  useImperativeHandle(ref, () => ({
    // Method to get current form data for saving
    getFormData: () => {
      // Return raw state for persistence between tabs
      const formData = {
        planDetails,
        deductibles,
        outOfPocket,
        coinsuranceValues,
        routinePreventive,
        primaryCare,
        specialist,
        inpatientHospitalization,
        outpatientSurgery,
        emergencyRoom,
        urgentCare,
        retailPrescription,
        financialSummary,
        footerNote,
        calculatedTotals
      };
      
      console.log('=== MedUHCTrustmarkTab.getFormData() ===');
      console.log('Specialist state:', specialist);
      console.log('Full form data:', formData);
      console.log('=====================================');
      
      return formData;
    },

    // Method to get formatted data for API
    getFormattedData: () => {
      console.log('MedUHCTrustmark getFormattedData called');
      console.log('Current state values:', {
        planDetails,
        deductibles,
        financialSummary,
        specialist
      });


      // Helper function to format prescription values
      const formatPrescriptionValue = (prescription) => {
        if (!prescription) return '';
        const { tier1, tier2, tier3, tier4 } = prescription;
        return `$${tier1 || 0}/$${tier2 || 0}/$${tier3 || 0}/$${tier4 || 0}`;
      };

      // Transform component state into the format expected by the API
      const formattedData = {
        organizationName: planDetails.organizationName,
        effectiveDate: planDetails.effectiveDate,
        description: planDetails.description,
        calculatedTotals: calculatedTotals,
        rateReduction: financialSummary.alternateRateReduction ? financialSummary.alternateRateReduction : 0,
        footerNote:footerNote,
        plans: {
          current: {
            planName: planDetails.currentPlan,
            network: planDetails.currentNetwork || "Choice Plus",
            medicalPlanOverview: planDetails.currentPlanOverview || "PPO",
            individualDeductible: deductibles.individualCurrent || 0,
            familyDeductible: deductibles.familyCurrent || 0,
            individualOutOfPocketMax: outOfPocket.individualCurrent || 0,
            familyOutOfPocketMax: outOfPocket.familyCurrent || 0,
            coinsurance: coinsuranceValues.current || 0,
            preventiveCare: `Covered at ${routinePreventive.currentValue}`,
            primaryCare: primaryCare.currentAmount ? `$${primaryCare.currentAmount} ${primaryCare.currentText || ''}`.trim() : (primaryCare.currentText || ""),
            specialist: specialist.currentAmount ? `$${specialist.currentAmount} ${specialist.currentType || ''}`.trim() : (specialist.currentType || ""),
            inpatientHospital: inpatientHospitalization.currentAmount ? `$${inpatientHospitalization.currentAmount} ${inpatientHospitalization.currentType || ''}`.trim() : (inpatientHospitalization.currentType || ""),
            outpatientSurgery: outpatientSurgery.currentAmount ? `$${outpatientSurgery.currentAmount} ${outpatientSurgery.currentType || ''}`.trim() : (outpatientSurgery.currentType || ""),
            emergencyRoom: emergencyRoom.currentAmount ? `$${emergencyRoom.currentAmount} ${emergencyRoom.currentType || ''}`.trim() : (emergencyRoom.currentType || ""),
            urgentCare: urgentCare.currentAmount ? `$${urgentCare.currentAmount} ${urgentCare.currentType || ''}`.trim() : (urgentCare.currentType || ""),
            prescriptionRetail: formatPrescriptionValue(retailPrescription.current),
            employeeNumber: Number(financialSummary.employeeCount) || 0,
            employeeRate: Number(financialSummary.employeeRateCurrent) || 0,
            employeeSpouseNumber: Number(financialSummary.employeeSpouseCount) || 0,
            employeeSpouseRate: Number(financialSummary.employeeSpouseRateCurrent) || 0,
            employeeChildNumber: Number(financialSummary.employeeChildrenCount) || 0,
            employeeChildRate: Number(financialSummary.employeeChildrenRateCurrent) || 0,
            familyNumber: Number(financialSummary.familyCount) || 0,
            familyRate: Number(financialSummary.familyRateCurrent) || 0
          },
          renewal: {
            planName: planDetails.renewalPlan,
            network: planDetails.renewalNetwork || "Choice Plus",
            medicalPlanOverview: planDetails.renewalPlanOverview || "PPO",
            individualDeductible: deductibles.individualRenewal || 0,
            familyDeductible: deductibles.familyRenewal || 0,
            individualOutOfPocketMax: outOfPocket.individualRenewal || 0,
            familyOutOfPocketMax: outOfPocket.familyRenewal || 0,
            coinsurance: coinsuranceValues.renewal || 0,
            preventiveCare: `Covered at ${routinePreventive.renewalValue}`,
            primaryCare: primaryCare.renewalAmount ? `$${primaryCare.renewalAmount} ${primaryCare.renewalText || ''}`.trim() : (primaryCare.renewalText || ""),
            specialist: specialist.renewalAmount ? `$${specialist.renewalAmount} ${specialist.renewalType || ''}`.trim() : (specialist.renewalType || ""),
            inpatientHospital: inpatientHospitalization.renewalAmount ? `$${inpatientHospitalization.renewalAmount} ${inpatientHospitalization.renewalType || ''}`.trim() : (inpatientHospitalization.renewalType || ""),
            outpatientSurgery: outpatientSurgery.renewalAmount ? `$${outpatientSurgery.renewalAmount} ${outpatientSurgery.renewalType || ''}`.trim() : (outpatientSurgery.renewalType || ""),
            emergencyRoom: emergencyRoom.renewalAmount ? `$${emergencyRoom.renewalAmount} ${emergencyRoom.renewalType || ''}`.trim() : (emergencyRoom.renewalType || ""),
            urgentCare: urgentCare.renewalAmount ? `$${urgentCare.renewalAmount} ${urgentCare.renewalType || ''}`.trim() : (urgentCare.renewalType || ""),
            prescriptionRetail: formatPrescriptionValue(retailPrescription.renewal),
            employeeRate: Number(financialSummary.employeeRateRenewal) || 0,
            employeeSpouseRate: Number(financialSummary.employeeSpouseRateRenewal) || 0,
            employeeChildRate: Number(financialSummary.employeeChildrenRateRenewal) || 0,
            familyRate: Number(financialSummary.familyRateRenewal) || 0
          },
          alternate: {
            planName: planDetails.alternatePlan,
            network: planDetails.alternateNetwork || "Cigna",
            medicalPlanOverview: planDetails.alternatePlanOverview || "PPO",
            individualDeductible: deductibles.individualAlternate || 0,
            familyDeductible: deductibles.familyAlternate || 0,
            individualOutOfPocketMax: outOfPocket.individualAlternate || 0,
            familyOutOfPocketMax: outOfPocket.familyAlternate || 0,
            coinsurance: coinsuranceValues.alternate || 0,
            preventiveCare: `Covered at ${routinePreventive.alternateValue}`,
            primaryCare: primaryCare.alternateAmount ? `$${primaryCare.alternateAmount} ${primaryCare.alternateText || ''}`.trim() : (primaryCare.alternateText || ""),
            specialist: specialist.alternateAmount ? `$${specialist.alternateAmount} ${specialist.alternateType || ''}`.trim() : (specialist.alternateType || ""),
            inpatientHospital: inpatientHospitalization.alternateAmount ? `$${inpatientHospitalization.alternateAmount} ${inpatientHospitalization.alternateType || ''}`.trim() : (inpatientHospitalization.alternateType || ""),
            outpatientSurgery: outpatientSurgery.alternateAmount ? `$${outpatientSurgery.alternateAmount} ${outpatientSurgery.alternateType || ''}`.trim() : (outpatientSurgery.alternateType || ""),
            emergencyRoom: emergencyRoom.alternateAmount ? `$${emergencyRoom.alternateAmount} ${emergencyRoom.alternateType || ''}`.trim() : (emergencyRoom.alternateType || ""),
            urgentCare: urgentCare.alternateAmount ? `$${urgentCare.alternateAmount} ${urgentCare.alternateType || ''}`.trim() : (urgentCare.alternateType || ""),
            prescriptionRetail: formatPrescriptionValue(retailPrescription.alternate),
            employeeRate: Number(financialSummary.employeeRateAlternate) || 0,
            employeeSpouseRate: Number(financialSummary.employeeSpouseRateAlternate) || 0,
            employeeChildRate: Number(financialSummary.employeeChildrenRateAlternate) || 0,
            familyRate: Number(financialSummary.familyRateAlternate) || 0
          }
        }
      };

      console.log('=== MedUHCTrustmarkTab.getFormattedData() OUTPUT ===');
      console.log('Specialist state values:', {
        current: `amount: "${specialist.currentAmount}", type: "${specialist.currentType}"`,
        renewal: `amount: "${specialist.renewalAmount}", type: "${specialist.renewalType}"`,
        alternate: `amount: "${specialist.alternateAmount}", type: "${specialist.alternateType}"`
      });
      console.log('Formatted specialist values:', {
        current: formattedData.plans.current.specialist,
        renewal: formattedData.plans.renewal.specialist,
        alternate: formattedData.plans.alternate.specialist
      });
      console.log('Full formatted data:', JSON.stringify(formattedData, null, 2));
      console.log('==================================================');
      
      return formattedData;
    },

    // Method to save data to Excel
    saveData: async () => {
      try {
        const formattedData = {
          organizationName: planDetails.organizationName,
          effectiveDate: planDetails.effectiveDate,
          description: planDetails.description,
          calculatedTotals: calculatedTotals,
          planDetails: {
            organizationName: planDetails.organizationName,
            effectiveDate: planDetails.effectiveDate,
            description: planDetails.description,
            currentPlan: planDetails.currentPlan,
            renewalPlan: planDetails.renewalPlan,
            alternatePlan: planDetails.alternatePlan,
            currentNetwork: planDetails.currentNetwork,
            renewalNetwork: planDetails.renewalNetwork,
            alternateNetwork: planDetails.alternateNetwork
          },
          deductibles,
          outOfPocket,
          coinsuranceValues,
          routinePreventive,
          primaryCare,
          specialist,
          inpatientHospitalization,
          outpatientSurgery,
          emergencyRoom,
          urgentCare,
          retailPrescription,
          financialSummary,
          calculatedTotals
        };

        const response = await fetch('/api/excel/medUHCTrustmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error saving MedUHCTrustmark data:', error);
        throw error;
      }
    }
  }));


  // Calculate totals whenever financial summary changes
  // Notify parent of data changes when fields change (with debouncing)
  useEffect(() => {
    // Create a timer to debounce updates
    const timer = setTimeout(() => {
      // Collect current form data
      const formData = {
        planDetails,
        deductibles,
        outOfPocket,
        coinsuranceValues,
        routinePreventive,
        primaryCare,
        specialist,
        inpatientHospitalization,
        outpatientSurgery,
        emergencyRoom,
        urgentCare,
        retailPrescription,
        financialSummary,
        footerNote,
        calculatedTotals
      };

      // Notify parent component of changes
      onDataChange(formData);
    }, 1000); // 1 second debounce

    // Clear the timer on cleanup
    return () => clearTimeout(timer);
  }, [
    planDetails, deductibles, outOfPocket, coinsuranceValues,
    routinePreventive, primaryCare, specialist, inpatientHospitalization,
    outpatientSurgery, emergencyRoom, urgentCare, retailPrescription,
    financialSummary, footerNote, calculatedTotals, onDataChange
  ]);

  useEffect(() => {
    // Parse numeric values with appropriate fallbacks
    const parseValue = (value) => {
      if (value === '' || isNaN(Number(value))) return 0;
      return Number(value);
    };

    // Employee totals
    const employeeTotal = parseValue(financialSummary.employeeCount) * parseValue(financialSummary.employeeRateCurrent);
    const renewalEmployeeTotal = parseValue(financialSummary.employeeCount) * parseValue(financialSummary.employeeRateRenewal);
    const alternateEmployeeTotal = parseValue(financialSummary.employeeCount) * parseValue(financialSummary.employeeRateAlternate);

    // Employee + Spouse totals
    const spouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRateCurrent);
    const renewalSpouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRateRenewal);
    const alternateSpouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRateAlternate);

    // Employee + Children totals
    const childrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRateCurrent);
    const renewalChildrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRateRenewal);
    const alternateChildrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRateAlternate);

    // Family totals
    const familyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRateCurrent);
    const renewalFamilyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRateRenewal);
    const alternateFamilyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRateAlternate);

    // Monthly totals
    const currentMonthlyTotal = employeeTotal + spouseTotal + childrenTotal + familyTotal;
    const renewalMonthlyTotal = renewalEmployeeTotal + renewalSpouseTotal + renewalChildrenTotal + renewalFamilyTotal;
    const alternateMonthlyTotal = alternateEmployeeTotal + alternateSpouseTotal + alternateChildrenTotal + alternateFamilyTotal;

    // Annual totals
    const currentAnnualTotal = currentMonthlyTotal * 12;
    const renewalAnnualTotal = renewalMonthlyTotal * 12;
    const alternateAnnualTotal = alternateMonthlyTotal * 12;

    // Annual dollar differences
    const annualDollarDiffRenewal = renewalAnnualTotal - currentAnnualTotal;
    const annualDollarDiffAlternate = alternateAnnualTotal - currentAnnualTotal;

    // Annual percent differences
    const annualPercentDiffRenewal = currentAnnualTotal !== 0 ?
      (renewalAnnualTotal - currentAnnualTotal) / currentAnnualTotal * 100 : 0;
    const annualPercentDiffAlternate = currentAnnualTotal !== 0 ?
      (alternateAnnualTotal - currentAnnualTotal) / currentAnnualTotal * 100 : 0;

    setCalculatedTotals({
      currentTotal: parseFloat(currentMonthlyTotal.toFixed(2)),
      renewalTotal: parseFloat(renewalMonthlyTotal.toFixed(2)),
      alternateTotal: parseFloat(alternateMonthlyTotal.toFixed(2)),
      currentAnnualPremium: parseFloat(currentAnnualTotal.toFixed(2)),
      renewalAnnualPremium: parseFloat(renewalAnnualTotal.toFixed(2)),
      alternateAnnualPremium: parseFloat(alternateAnnualTotal.toFixed(2)),
      annualDollarDiffRenewal: parseFloat(annualDollarDiffRenewal.toFixed(2)),
      annualDollarDiffAlternate: parseFloat(annualDollarDiffAlternate.toFixed(2)),
      annualPercentDiffRenewal: parseFloat(annualPercentDiffRenewal.toFixed(2)),
      annualPercentDiffAlternate: parseFloat(annualPercentDiffAlternate.toFixed(2))
    });
  }, [financialSummary]);

  // Handler for updating text input values
  const handleTextInputChange = (field, value) => {
    setPlanDetails({
      ...planDetails,
      [field]: value
    });
    
    // Update shared context if it's organizationName or effectiveDate
    if (field === 'organizationName' || field === 'effectiveDate') {
      updateSharedOrgDetails({ [field]: value });
    }
  };

  // Handler for updating routine preventive care values
  const handleRoutinePreventiveChange = (field, value) => {
    setRoutinePreventive({
      ...routinePreventive,
      [field]: value
    });
  };

  // Generic handler for numeric-only fields
  const createNumericHandler = (setter, currentState) => (field, value) => {
    setter({
      ...currentState,
      [field]: value === '' ? '0' : value
    });
  };

  // Generic handler for mixed text/numeric fields
  const createMixedHandler = (setter, currentState, textFields) => (field, value) => {
    setter({
      ...currentState,
      [field]: textFields.includes(field) ? value : (value === '' ? '0' : value)
    });
  };

  // Create specific handlers using the generic functions
  const handleDeductibleChange = createNumericHandler(setDeductibles, deductibles);
  const handleOutOfPocketChange = createNumericHandler(setOutOfPocket, outOfPocket);
  const handleCoinsuranceChange = createNumericHandler(setCoinsuranceValues, coinsuranceValues);
  const handleFinancialSummaryChange = createNumericHandler(setFinancialSummary, financialSummary);
  
  const handlePrimaryCareChange = createMixedHandler(setPrimaryCare, primaryCare, ['currentText', 'renewalText', 'alternateText']);
  const handleSpecialistChange = createMixedHandler(setSpecialist, specialist, ['currentType', 'renewalType', 'alternateType']);
  const handleInpatientHospitalizationChange = createMixedHandler(setInpatientHospitalization, inpatientHospitalization, ['currentType', 'renewalType', 'alternateType']);
  const handleOutpatientSurgeryChange = createMixedHandler(setOutpatientSurgery, outpatientSurgery, ['currentType', 'renewalType', 'alternateType']);
  const handleEmergencyRoomChange = createMixedHandler(setEmergencyRoom, emergencyRoom, ['currentType', 'renewalType', 'alternateType']);
  const handleUrgentCareChange = createMixedHandler(setUrgentCare, urgentCare, ['currentType', 'renewalType', 'alternateType']);

  // Handler for updating retail prescription values
  const handleRetailPrescriptionChange = (plan, tier, value) => {
    setRetailPrescription({
      ...retailPrescription,
      [plan]: {
        ...retailPrescription[plan],
        [tier]: value === '' ? '0' : value
      }
    });
  };


  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto w-full px-4 py-6 bg-white shadow-sm mb-4 rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h6v2H7v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="organizationName"
                className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                value={planDetails.organizationName}
                onChange={(e) => handleTextInputChange('organizationName', e.target.value)}
                placeholder="Enter organization name"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="effectiveDate"
                className="block w-full rounded-md border-0 py-2.5 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                value={planDetails.effectiveDate}
                onChange={(e) => handleTextInputChange('effectiveDate', e.target.value)}
                placeholder="MM/DD/YYYY or type date"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Custom Calendar Dropdown */}
              {showCalendar && (
                <div
                  ref={calendarRef}
                  className="absolute right-0 mt-2 top-full z-10 w-64 bg-white rounded-md shadow-lg p-2 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <button
                      className="p-1 hover:bg-gray-100 rounded-full"
                      onClick={() => {
                        const prevMonth = new Date(currentMonth);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        setCurrentMonth(prevMonth);
                      }}
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="font-medium">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                      className="p-1 hover:bg-gray-100 rounded-full"
                      onClick={() => {
                        const nextMonth = new Date(currentMonth);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        setCurrentMonth(nextMonth);
                      }}
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="py-1">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 mt-1">
                    {(() => {
                      const days = [];
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

                      // Fill in days from previous month
                      const firstDayOfMonth = date.getDay();
                      for (let i = 0; i < firstDayOfMonth; i++) {
                        days.push(
                          <div key={`prev-${i}`} className="py-1 text-center text-gray-300 cursor-default">
                            {new Date(date.getFullYear(), date.getMonth(), 0 - (firstDayOfMonth - i - 1)).getDate()}
                          </div>
                        );
                      }

                      // Fill in days of current month
                      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                      for (let i = 1; i <= daysInMonth; i++) {
                        const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
                        const isCurrentDate = dayDate.toDateString() === new Date().toDateString();

                        days.push(
                          <div
                            key={`current-${i}`}
                            className={`py-1 text-center rounded-full cursor-pointer hover:bg-indigo-100 ${isCurrentDate ? 'bg-indigo-50 text-indigo-600 font-medium' : ''}`}
                            onClick={() => {
                              const selectedDate = new Date(date.getFullYear(), date.getMonth(), i);
                              const options = { year: 'numeric', month: 'long', day: 'numeric' };
                              handleTextInputChange('effectiveDate', selectedDate.toLocaleDateString('en-US', options));
                              setShowCalendar(false);
                            }}
                          >
                            {i}
                          </div>
                        );
                      }

                      // Fill in days from next month
                      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
                      const remainingCells = 7 - lastDayOfMonth - 1;
                      for (let i = 1; i <= remainingCells; i++) {
                        days.push(
                          <div key={`next-${i}`} className="py-1 text-center text-gray-300 cursor-default">
                            {i}
                          </div>
                        );
                      }

                      return days;
                    })()}
                  </div>

                  <div className="mt-2 flex justify-between border-t pt-2">
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                      onClick={() => {
                        const today = new Date();
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        handleTextInputChange('effectiveDate', today.toLocaleDateString('en-US', options));
                        setShowCalendar(false);
                      }}
                    >
                      Today
                    </button>
                    <button
                      className="text-sm text-gray-600 hover:text-gray-800"
                      onClick={() => setShowCalendar(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Headers - Editable */}
      <div className="max-w-7xl mx-auto w-full px-4 py-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1"></div>
          <div className="col-span-1 bg-indigo-700 text-white p-3 rounded-t-lg font-medium text-center">
            <textarea
              className="w-full bg-transparent border-0 text-white text-center resize-none focus:ring-2 focus:ring-white py-1"
              rows="3"
              value={planDetails.currentPlan}
              onChange={(e) => handleTextInputChange('currentPlan', e.target.value)}
              placeholder="Current Plan Details"
            ></textarea>
          </div>
          <div className="col-span-1 bg-indigo-700 text-white p-3 rounded-t-lg font-medium text-center">
            <textarea
              className="w-full bg-transparent border-0 text-white text-center resize-none focus:ring-2 focus:ring-white py-1"
              rows="3"
              value={planDetails.renewalPlan}
              onChange={(e) => handleTextInputChange('renewalPlan', e.target.value)}
              placeholder="Renewal Plan Details"
            ></textarea>
          </div>
          <div className="col-span-1 bg-indigo-700 text-white p-3 rounded-t-lg font-medium text-center">
            <textarea
              className="w-full bg-transparent border-0 text-white text-center resize-none focus:ring-2 focus:ring-white py-1"
              rows="3"
              value={planDetails.alternatePlan}
              onChange={(e) => handleTextInputChange('alternatePlan', e.target.value)}
              placeholder="Alternate Plan Details"
            ></textarea>
          </div>
        </div>

        {/* Network Banner */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-indigo-700 text-white p-2 font-medium">
            NETWORK
          </div>
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.currentNetwork}
              onChange={(e) => handleTextInputChange('currentNetwork', e.target.value)}
              placeholder="Insert Network Name"
            />
          </div>
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.renewalNetwork}
              onChange={(e) => handleTextInputChange('renewalNetwork', e.target.value)}
              placeholder="Insert Network Name"
            />
          </div>
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.alternateNetwork}
              onChange={(e) => handleTextInputChange('alternateNetwork', e.target.value)}
              placeholder="Insert Network Name"
            />
          </div>
        </div>

        {/* Medical Plan Overview */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-indigo-700 text-white p-2 font-medium">
            MEDICAL PLAN OVERVIEW
          </div>
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.currentPlanOverview}
              onChange={(e) => handleTextInputChange('currentPlanOverview', e.target.value)}
              placeholder="In Network Benefits"
            />
          </div>
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.renewalPlanOverview}
              onChange={(e) => handleTextInputChange('renewalPlanOverview', e.target.value)}
              placeholder="In Network Benefits"
            />
          </div>
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.alternatePlanOverview}
              onChange={(e) => handleTextInputChange('alternatePlanOverview', e.target.value)}
              placeholder="In Network Benefits"
            />
          </div>
        </div>

        {/* Annual Deductible Section */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            ANNUAL DEDUCTIBLE
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Deductible Individual Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Individual
          </div>
          <div className={CSS_CLASSES.inputCell}>
            <div className="relative">
              <span className={CSS_CLASSES.dollarIcon}>$</span>
              <input
                type="text"
                value={deductibles.individualCurrent}
                onChange={(e) => handleDeductibleChange('individualCurrent', e.target.value)}
                className={CSS_CLASSES.numberInput}
                placeholder="0"
              />
            </div>
          </div>
          <div className={CSS_CLASSES.inputCell}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={deductibles.individualRenewal}
                onChange={(e) => handleDeductibleChange('individualRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={deductibles.individualAlternate}
                onChange={(e) => handleDeductibleChange('individualAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Deductible Family Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Family
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={deductibles.familyCurrent}
                onChange={(e) => handleDeductibleChange('familyCurrent', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={deductibles.familyRenewal}
                onChange={(e) => handleDeductibleChange('familyRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={deductibles.familyAlternate}
                onChange={(e) => handleDeductibleChange('familyAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Annual Maximum Out of Pocket Section */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            ANNUAL MAXIMUM OUT OF POCKET
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Out of Pocket Individual Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Individual
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={outOfPocket.individualCurrent}
                onChange={(e) => handleOutOfPocketChange('individualCurrent', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={outOfPocket.individualRenewal}
                onChange={(e) => handleOutOfPocketChange('individualRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={outOfPocket.individualAlternate}
                onChange={(e) => handleOutOfPocketChange('individualAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Out of Pocket Family Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Family
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={outOfPocket.familyCurrent}
                onChange={(e) => handleOutOfPocketChange('familyCurrent', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={outOfPocket.familyRenewal}
                onChange={(e) => handleOutOfPocketChange('familyRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={outOfPocket.familyAlternate}
                onChange={(e) => handleOutOfPocketChange('familyAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Coinsurance Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Coinsurance
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center">
              <input
                type="text"
                value={coinsuranceValues.current}
                onChange={(e) => handleCoinsuranceChange('current', e.target.value)}
                className="w-16 rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
              <span className="ml-1 text-slate-900">%</span>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center">
              <input
                type="text"
                value={coinsuranceValues.renewal}
                onChange={(e) => handleCoinsuranceChange('renewal', e.target.value)}
                className="w-16 rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
              <span className="ml-1 text-slate-900">%</span>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center">
              <input
                type="text"
                value={coinsuranceValues.alternate}
                onChange={(e) => handleCoinsuranceChange('alternate', e.target.value)}
                className="w-16 rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
              <span className="ml-1 text-slate-900">%</span>
            </div>
          </div>
        </div>

        {/* Physician Visits Section */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            PHYSICIAN VISITS
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Routine Preventive Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Routine Preventive
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-700 font-medium">Covered at</span>
              <input
                type="text"
                className="w-16 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                value={routinePreventive.currentValue}
                onChange={(e) => handleRoutinePreventiveChange('currentValue', e.target.value)}
                placeholder="100%"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-700 font-medium">Covered at</span>
              <input
                type="text"
                className="w-16 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                value={routinePreventive.renewalValue}
                onChange={(e) => handleRoutinePreventiveChange('renewalValue', e.target.value)}
                placeholder="100%"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-700 font-medium">Covered at</span>
              <input
                type="text"
                className="w-16 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                value={routinePreventive.alternateValue}
                onChange={(e) => handleRoutinePreventiveChange('alternateValue', e.target.value)}
                placeholder="100%"
              />
            </div>
          </div>
        </div>

        {/* Primary Care Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Primary Care
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={primaryCare.currentAmount}
                  onChange={(e) => handlePrimaryCareChange('currentAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <input
                type="text"
                value={primaryCare.currentText}
                onChange={(e) => handlePrimaryCareChange('currentText', e.target.value)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="Enter description"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={primaryCare.renewalAmount}
                  onChange={(e) => handlePrimaryCareChange('renewalAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <input
                type="text"
                value={primaryCare.renewalText}
                onChange={(e) => handlePrimaryCareChange('renewalText', e.target.value)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="Enter description"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={primaryCare.alternateAmount}
                  onChange={(e) => handlePrimaryCareChange('alternateAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <input
                type="text"
                value={primaryCare.alternateText}
                onChange={(e) => handlePrimaryCareChange('alternateText', e.target.value)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        {/* Specialist Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Specialist
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={specialist.currentAmount}
                  onChange={(e) => handleSpecialistChange('currentAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={specialist.currentType}
                onChange={(e) => handleSpecialistChange('currentType', e.target.value)}
                className={CSS_CLASSES.dropdown}
              >
                {TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={specialist.renewalAmount}
                  onChange={(e) => handleSpecialistChange('renewalAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={specialist.renewalType}
                onChange={(e) => handleSpecialistChange('renewalType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={specialist.alternateAmount}
                  onChange={(e) => handleSpecialistChange('alternateAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={specialist.alternateType}
                onChange={(e) => handleSpecialistChange('alternateType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hospital Services Section */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            HOSPITAL SERVICES
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Inpatient Hospitalization Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Inpatient Hospitalization
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={inpatientHospitalization.currentAmount}
                  onChange={(e) => handleInpatientHospitalizationChange('currentAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={inpatientHospitalization.currentType}
                onChange={(e) => handleInpatientHospitalizationChange('currentType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={inpatientHospitalization.renewalAmount}
                  onChange={(e) => handleInpatientHospitalizationChange('renewalAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={inpatientHospitalization.renewalType}
                onChange={(e) => handleInpatientHospitalizationChange('renewalType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={inpatientHospitalization.alternateAmount}
                  onChange={(e) => handleInpatientHospitalizationChange('alternateAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={inpatientHospitalization.alternateType}
                onChange={(e) => handleInpatientHospitalizationChange('alternateType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Outpatient Surgery Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Outpatient Surgery
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={outpatientSurgery.currentAmount}
                  onChange={(e) => handleOutpatientSurgeryChange('currentAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={outpatientSurgery.currentType}
                onChange={(e) => handleOutpatientSurgeryChange('currentType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={outpatientSurgery.renewalAmount}
                  onChange={(e) => handleOutpatientSurgeryChange('renewalAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={outpatientSurgery.renewalType}
                onChange={(e) => handleOutpatientSurgeryChange('renewalType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={outpatientSurgery.alternateAmount}
                  onChange={(e) => handleOutpatientSurgeryChange('alternateAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={outpatientSurgery.alternateType}
                onChange={(e) => handleOutpatientSurgeryChange('alternateType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Room Visit Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Emergency Room Visit
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={emergencyRoom.currentAmount}
                  onChange={(e) => handleEmergencyRoomChange('currentAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={emergencyRoom.currentType}
                onChange={(e) => handleEmergencyRoomChange('currentType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={emergencyRoom.renewalAmount}
                  onChange={(e) => handleEmergencyRoomChange('renewalAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={emergencyRoom.renewalType}
                onChange={(e) => handleEmergencyRoomChange('renewalType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={emergencyRoom.alternateAmount}
                  onChange={(e) => handleEmergencyRoomChange('alternateAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={emergencyRoom.alternateType}
                onChange={(e) => handleEmergencyRoomChange('alternateType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Urgent Care Visit Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Urgent Care Visit
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={urgentCare.currentAmount}
                  onChange={(e) => handleUrgentCareChange('currentAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={urgentCare.currentType}
                onChange={(e) => handleUrgentCareChange('currentType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={urgentCare.renewalAmount}
                  onChange={(e) => handleUrgentCareChange('renewalAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={urgentCare.renewalType}
                onChange={(e) => handleUrgentCareChange('renewalType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2 items-center">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={urgentCare.alternateAmount}
                  onChange={(e) => handleUrgentCareChange('alternateAmount', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <select
                value={urgentCare.alternateType}
                onChange={(e) => handleUrgentCareChange('alternateType', e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prescription Drug Benefit Section */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            PRESCRIPTION DRUG BENEFIT
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Retail Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Retail
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.current.tier1}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier1', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.current.tier2}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier2', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.current.tier3}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier3', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.current.tier4}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier4', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.renewal.tier1}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier1', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.renewal.tier2}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier2', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.renewal.tier3}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier3', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-14">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="text"
                  value={retailPrescription.renewal.tier4}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier4', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center space-x-1">
                <div className="relative w-14">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                  <input
                    type="text"
                    value={retailPrescription.alternate.tier1}
                    onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier1', e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  />
                </div>
                <span className="text-slate-400">/</span>
                <div className="relative w-14">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                  <input
                    type="text"
                    value={retailPrescription.alternate.tier2}
                    onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier2', e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  />
                </div>
                <span className="text-slate-400">/</span>
                <div className="relative w-14">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                  <input
                    type="text"
                    value={retailPrescription.alternate.tier3}
                    onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier3', e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  />
                </div>
                <span className="text-slate-400">/</span>
                <div className="relative w-14">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                  <input
                    type="text"
                    value={retailPrescription.alternate.tier4}
                    onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier4', e.target.value)}
                    className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  />
                </div>
              </div>
              {/* Special Note Input */}
              <div className="mt-2">
                <input
                  type="text"
                  value={retailPrescription.alternate.specialNote}
                  onChange={(e) => handleRetailPrescriptionChange('alternate', 'specialNote', e.target.value)}
                  className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center text-sm"
                  placeholder="Special note"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary Section */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="col-span-1 bg-indigo-700 text-white p-2 font-medium">
            FINANCIAL SUMMARY
          </div>
          <div className="col-span-1 text-center bg-indigo-100 p-2 text-indigo-800 font-medium">
            Current Rates
          </div>
          <div className="col-span-1 text-center bg-indigo-100 p-2 text-indigo-800 font-medium">
            Renewal Rates
          </div>
          <div className="col-span-1 text-center bg-indigo-100 p-2 text-indigo-800 font-medium">
            Alternate Rates
          </div>
        </div>

        {/* Employee Row - With Editable Count */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium flex justify-between">
            <span>Employee</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="text"
                value={financialSummary.employeeCount}
                onChange={(e) => handleFinancialSummaryChange('employeeCount', e.target.value)}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('employeeRateCurrent', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('employeeRateRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('employeeRateAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Employee + Spouse Row - With Editable Count */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Employee + Spouse</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="text"
                value={financialSummary.employeeSpouseCount}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseCount', e.target.value)}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeSpouseRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseRateCurrent', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeSpouseRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseRateRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeSpouseRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseRateAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Employee + Child(ren) Row - With Editable Count */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Employee + Child(ren)</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="text"
                value={financialSummary.employeeChildrenCount}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenCount', e.target.value)}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeChildrenRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenRateCurrent', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeChildrenRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenRateRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.employeeChildrenRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenRateAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Family Row - With Editable Count */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Family</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="text"
                value={financialSummary.familyCount}
                onChange={(e) => handleFinancialSummaryChange('familyCount', e.target.value)}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.familyRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('familyRateCurrent', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.familyRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('familyRateRenewal', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={financialSummary.familyRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('familyRateAlternate', e.target.value)}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Totals Row - Made Uneditable */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium">
            Totals
          </div>
          <div className="col-span-1 p-2 bg-slate-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.currentTotal)}
                disabled
                className="bg-slate-100 block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-slate-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.renewalTotal)}
                disabled
                className="bg-slate-100 block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-slate-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.alternateTotal)}
                disabled
                className="bg-slate-100 block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
        </div>

        {/* Rate Change Row - Displaying percent reduction only in the alternate column */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center">
              <div className="text-red-600 font-medium flex items-center">
                <input
                  type="text"
                  className="w-16 rounded-md border-0 py-1.5 text-red-600 bg-transparent ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-red-400 text-center font-medium"
                  value={financialSummary.alternateRateReduction}
                  onChange={(e) => handleFinancialSummaryChange('alternateRateReduction', e.target.value)}
                />
                <span className="ml-1">% Rate Reduction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Annual Premium - Made Uneditable */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1 bg-indigo-700 text-white p-2 font-medium">
            Total Annual Premium
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.currentAnnualPremium)}
                disabled
                className="bg-indigo-100 block w-full rounded-md border-0 py-2 pl-8 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.renewalAnnualPremium)}
                disabled
                className="bg-indigo-100 block w-full rounded-md border-0 py-2 pl-8 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.alternateAnnualPremium)}
                disabled
                className="bg-indigo-100 block w-full rounded-md border-0 py-2 pl-8 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
        </div>

        {/* Removed Total Annual Dollar Difference Row */}
        {/* Removed Total Annual Percent Difference Row */}

        {/* Note about prudent Rx for speciality Rx */}
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <div className="col-span-1 p-2 text-right">
            <div className="flex items-center justify-end">
              <span className="text-sm text-indigo-800 mr-2">**</span>
              <input
                type="text"
                className="w-full max-w-xs text-sm rounded-md border-0 py-1 text-indigo-800 bg-transparent ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-400"
                value={footerNote.replace(/^\*\* /, '')}
                onChange={(e) => setFooterNote(`** ${e.target.value}`)}
                placeholder="Enter note for specialty prescriptions"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

// Set display name for debugging purposes
MedUHCTrustmarkTab.displayName = 'MedUHCTrustmarkTab';

export default MedUHCTrustmarkTab;

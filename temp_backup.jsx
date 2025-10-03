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
  dropdown: "block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
};

// Constants for dropdown options
const TYPE_OPTIONS = [
  { value: '', label: 'Select type' },
  { value: 'Copay', label: 'Copay' },
  { value: 'Deductible', label: 'Deductible' },
  { value: 'Copay + Deductible', label: 'Copay + Deductible' }
];

const MedUHC2Tab = forwardRef(({ initialData = null, onDataChange = () => {} }, ref) => {
  // Access shared organization details from context
  const { sharedOrgDetails, updateSharedOrgDetails } = useFormData();

  // State management for plan details
  const [planDetails, setPlanDetails] = useState({
    organizationName: "",
    effectiveDate: "",
    currentPlan: "",
    renewalPlan: "",
    alternatePlan: "",
    fourthPlan: "",
    currentNetwork: "",
    renewalNetwork: "",
    alternateNetwork: "",
    fourthNetwork: "",
    currentPlanOverview: "",
    renewalPlanOverview: "",
    alternatePlanOverview: "",
    fourthPlanOverview: ""
  });

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  // Apply initial data if available
  useEffect(() => {
    if (initialData) {
      // Set all the state from the persisted data
      if (initialData.planDetails) {
        setPlanDetails(() => ({
          ...initialData.planDetails,
          organizationName: sharedOrgDetails.organizationName || initialData.planDetails.organizationName || "",
          effectiveDate: sharedOrgDetails.effectiveDate || initialData.planDetails.effectiveDate || ""
        }));
      }
      if (initialData.deductibles) setDeductibles(initialData.deductibles);
      if (initialData.outOfPocket) setOutOfPocket(initialData.outOfPocket);
      if (initialData.coinsuranceValues) setCoinsuranceValues(initialData.coinsuranceValues);
      if (initialData.primaryCare) setPrimaryCare(initialData.primaryCare);
      if (initialData.specialist) setSpecialist(initialData.specialist);
      if (initialData.inpatientHospitalization) setInpatientHospitalization(initialData.inpatientHospitalization);
      if (initialData.outpatientSurgery) setOutpatientSurgery(initialData.outpatientSurgery);
      if (initialData.emergencyRoom) setEmergencyRoom(initialData.emergencyRoom);
      if (initialData.urgentCare) setUrgentCare(initialData.urgentCare);
      if (initialData.retailPrescription) setRetailPrescription(initialData.retailPrescription);
      if (initialData.financialSummary) setFinancialSummary(initialData.financialSummary);
      if (initialData.calculatedTotals) setCalculatedTotals(initialData.calculatedTotals);
    }
  }, [initialData, sharedOrgDetails]);

  // Sync with shared organization details
  useEffect(() => {
    setPlanDetails(prev => ({
      ...prev,
      organizationName: sharedOrgDetails.organizationName || prev.organizationName,
      effectiveDate: sharedOrgDetails.effectiveDate || prev.effectiveDate
    }));
  }, [sharedOrgDetails]);

  // Deductible values
  const [deductibles, setDeductibles] = useState({
    individualCurrent: '',
    individualRenewal: '',
    individualAlternate: '',
    individualFourth: '',
    familyCurrent: '',
    familyRenewal: '',
    familyAlternate: '',
    familyFourth: ''
  });

  // Out of pocket values
  const [outOfPocket, setOutOfPocket] = useState({
    individualCurrent: '',
    individualRenewal: '',
    individualAlternate: '',
    individualFourth: '',
    familyCurrent: '',
    familyRenewal: '',
    familyAlternate: '',
    familyFourth: ''
  });

  // Coinsurance values with independent sliders
  const [coinsuranceValues, setCoinsuranceValues] = useState({
    current: 0,
    renewal: 0,
    alternate: 0,
    fourth: 0,
    routineCurrent: 0,
    routineRenewal: 0,
    routineAlternate: 0,
    routineFourth: 0
  });

  // Primary care values
  const [primaryCare, setPrimaryCare] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    fourthAmount: '',
    currentText: "",
    renewalText: "",
    alternateText: "",
    fourthText: ""
  });

  // Specialist values
  const [specialist, setSpecialist] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    fourthAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: "",
    fourthType: ""
  });

  // Inpatient Hospitalization values
  const [inpatientHospitalization, setInpatientHospitalization] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    fourthAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: "",
    fourthType: ""
  });

  // Outpatient Surgery values
  const [outpatientSurgery, setOutpatientSurgery] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    fourthAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: "",
    fourthType: ""
  });

  // Emergency room values
  const [emergencyRoom, setEmergencyRoom] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    fourthAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: "",
    fourthType: ""
  });

  // Urgent care values
  const [urgentCare, setUrgentCare] = useState({
    currentAmount: '',
    renewalAmount: '',
    alternateAmount: '',
    fourthAmount: '',
    currentType: "",
    renewalType: "",
    alternateType: "",
    fourthType: ""
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
      tier4: ''
    },
    fourth: {
      tier1: '',
      tier2: '',
      tier3: '',
      tier4: ''
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
    employeeRateFourth: '',
    employeeSpouseRateCurrent: '',
    employeeSpouseRateRenewal: '',
    employeeSpouseRateAlternate: '',
    employeeSpouseRateFourth: '',
    employeeChildrenRateCurrent: '',
    employeeChildrenRateRenewal: '',
    employeeChildrenRateAlternate: '',
    employeeChildrenRateFourth: '',
    familyRateCurrent: '',
    familyRateRenewal: '',
    familyRateAlternate: '',
    familyRateFourth: '',
  });

  // Calculated total values
  const [calculatedTotals, setCalculatedTotals] = useState({
    currentTotal: 0,
    renewalTotal: 0,
    alternateTotal: 0,
    fourthTotal: 0,
    currentAnnualPremium: 0,
    renewalAnnualPremium: 0,
    alternateAnnualPremium: 0,
    fourthAnnualPremium: 0,
    annualDollarDiffRenewal: 0,
    annualDollarDiffAlternate: 0,
    annualDollarDiffFourth: 0,
    annualPercentDiffRenewal: 0,
    annualPercentDiffAlternate: 0,
    annualPercentDiffFourth: 0
  });

  // Calculate totals whenever financial summary changes
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
    const fourthEmployeeTotal = parseValue(financialSummary.employeeCount) * parseValue(financialSummary.employeeRateFourth);

    // Employee + Spouse totals
    const spouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRateCurrent);
    const renewalSpouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRateRenewal);
    const alternateSpouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRateAlternate);
    const fourthSpouseTotal = parseValue(financialSummary.employeeSpouseCount) * parseValue(financialSummary.employeeSpouseRateFourth);

    // Employee + Children totals
    const childrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRateCurrent);
    const renewalChildrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRateRenewal);
    const alternateChildrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRateAlternate);
    const fourthChildrenTotal = parseValue(financialSummary.employeeChildrenCount) * parseValue(financialSummary.employeeChildrenRateFourth);

    // Family totals
    const familyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRateCurrent);
    const renewalFamilyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRateRenewal);
    const alternateFamilyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRateAlternate);
    const fourthFamilyTotal = parseValue(financialSummary.familyCount) * parseValue(financialSummary.familyRateFourth);

    // Monthly totals
    const currentMonthlyTotal = employeeTotal + spouseTotal + childrenTotal + familyTotal;
    const renewalMonthlyTotal = renewalEmployeeTotal + renewalSpouseTotal + renewalChildrenTotal + renewalFamilyTotal;
    const alternateMonthlyTotal = alternateEmployeeTotal + alternateSpouseTotal + alternateChildrenTotal + alternateFamilyTotal;
    const fourthMonthlyTotal = fourthEmployeeTotal + fourthSpouseTotal + fourthChildrenTotal + fourthFamilyTotal;

    // Annual totals
    const currentAnnualTotal = currentMonthlyTotal * 12;
    const renewalAnnualTotal = renewalMonthlyTotal * 12;
    const alternateAnnualTotal = alternateMonthlyTotal * 12;
    const fourthAnnualTotal = fourthMonthlyTotal * 12;

    // Annual dollar differences
    const annualDollarDiffRenewal = renewalAnnualTotal - currentAnnualTotal;
    const annualDollarDiffAlternate = alternateAnnualTotal - currentAnnualTotal;
    const annualDollarDiffFourth = fourthAnnualTotal - currentAnnualTotal;

    // Annual percent differences
    const annualPercentDiffRenewal = currentAnnualTotal !== 0 ?
      (renewalAnnualTotal - currentAnnualTotal) / currentAnnualTotal * 100 : 0;
    const annualPercentDiffAlternate = currentAnnualTotal !== 0 ?
      (alternateAnnualTotal - currentAnnualTotal) / currentAnnualTotal * 100 : 0;
    const annualPercentDiffFourth = currentAnnualTotal !== 0 ?
      (fourthAnnualTotal - currentAnnualTotal) / currentAnnualTotal * 100 : 0;

    setCalculatedTotals({
      currentTotal: parseFloat(currentMonthlyTotal.toFixed(2)),
      renewalTotal: parseFloat(renewalMonthlyTotal.toFixed(2)),
      alternateTotal: parseFloat(alternateMonthlyTotal.toFixed(2)),
      fourthTotal: parseFloat(fourthMonthlyTotal.toFixed(2)),
      currentAnnualPremium: parseFloat(currentAnnualTotal.toFixed(2)),
      renewalAnnualPremium: parseFloat(renewalAnnualTotal.toFixed(2)),
      alternateAnnualPremium: parseFloat(alternateAnnualTotal.toFixed(2)),
      fourthAnnualPremium: parseFloat(fourthAnnualTotal.toFixed(2)),
      annualDollarDiffRenewal: parseFloat(annualDollarDiffRenewal.toFixed(2)),
      annualDollarDiffAlternate: parseFloat(annualDollarDiffAlternate.toFixed(2)),
      annualDollarDiffFourth: parseFloat(annualDollarDiffFourth.toFixed(2)),
      annualPercentDiffRenewal: parseFloat(annualPercentDiffRenewal.toFixed(2)),
      annualPercentDiffAlternate: parseFloat(annualPercentDiffAlternate.toFixed(2)),
      annualPercentDiffFourth: parseFloat(annualPercentDiffFourth.toFixed(2))
    });
  }, [financialSummary]);

  // Helper function for formatting field values
  const formatFieldValue = (amountField, textField, fallback = "") => {
    return amountField ? `$${amountField} ${textField || ''}`.trim() : (textField || fallback);
  };

  // Helper function to format prescription values
  const formatPrescriptionValue = (prescription) => {
    if (!prescription) return '';
    const { tier1, tier2, tier3, tier4 } = prescription;
    return `$${tier1 || 0}/$${tier2 || 0}/$${tier3 || 0}/$${tier4 || 0}`;
  };

  // Handler for updating individual slider values
  const handleSliderChange = (plan, value) => {
    setCoinsuranceValues({
      ...coinsuranceValues,
      [plan]: value
    });
  };

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

  // Generic handler for numeric-only fields
  const createNumericHandler = (setter, currentState) => (field, value) => {
    setter({
      ...currentState,
      [field]: value === '' ? '' : Number(value)
    });
  };

  // Generic handler for mixed text/numeric fields
  const createMixedHandler = (setter, currentState, textFields) => (field, value) => {
    setter({
      ...currentState,
      [field]: textFields.includes(field) ? value : (value === '' ? '' : Number(value))
    });
  };

  // Create specific handlers using the generic functions
  const handleDeductibleChange = createNumericHandler(setDeductibles, deductibles);
  const handleOutOfPocketChange = createNumericHandler(setOutOfPocket, outOfPocket);
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
        [tier]: value === '' ? '' : Number(value)
      }
    });
  };

  // Handler for dropdown menu changes
  const handleDropdownChange = (category, field, event) => {
    const value = event.target.value;

    switch(category) {
      case 'specialist':
        setSpecialist({
          ...specialist,
          [field]: value
        });
        break;
      case 'inpatientHospitalization':
        setInpatientHospitalization({
          ...inpatientHospitalization,
          [field]: value
        });
        break;
      case 'outpatientSurgery':
        setOutpatientSurgery({
          ...outpatientSurgery,
          [field]: value
        });
        break;
      case 'emergencyRoom':
        setEmergencyRoom({
          ...emergencyRoom,
          [field]: value
        });
        break;
      case 'urgentCare':
        setUrgentCare({
          ...urgentCare,
          [field]: value
        });
        break;
      default:
        break;
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Method to get current form data for saving
    getFormData: () => {
      // Return raw state for persistence between tabs
      return {
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
        calculatedTotals
      };
    },

    // Method to get formatted data for API
    getFormattedData: () => {
      // Transform component state into the format expected by the API
      return {
        organizationName: planDetails.organizationName,
        effectiveDate: planDetails.effectiveDate,
        plans: {
          current: {
            planName: planDetails.currentPlan || "Current Plan",
            network: planDetails.currentNetwork || "",
            medicalPlanOverview: planDetails.currentPlanOverview || "",
            employeeNumber: financialSummary.employeeCount || 0,
            employeeSpouseNumber: financialSummary.employeeSpouseCount || 0,
            employeeChildNumber: financialSummary.employeeChildrenCount || 0,
            familyNumber: financialSummary.familyCount || 0,
            individualDeductible: deductibles.individualCurrent || 0,
            familyDeductible: deductibles.familyCurrent || 0,
            individualOutOfPocketMax: outOfPocket.individualCurrent || 0,
            familyOutOfPocketMax: outOfPocket.familyCurrent || 0,
            coinsurance: coinsuranceValues.current || 0,
            preventiveCare: `Covered ${coinsuranceValues.routineCurrent || 100}%`,
            primaryCare: formatFieldValue(primaryCare.currentAmount, primaryCare.currentText),
            specialist: formatFieldValue(specialist.currentAmount, specialist.currentType),
            inpatientHospital: formatFieldValue(inpatientHospitalization.currentAmount, inpatientHospitalization.currentType),
            outpatientSurgery: formatFieldValue(outpatientSurgery.currentAmount, outpatientSurgery.currentType),
            emergencyRoom: formatFieldValue(emergencyRoom.currentAmount, emergencyRoom.currentType),
            urgentCare: formatFieldValue(urgentCare.currentAmount, urgentCare.currentType),
            prescriptionRetail: formatPrescriptionValue(retailPrescription.current),
            employeeRate: financialSummary.employeeRateCurrent || 0,
            employeeSpouseRate: financialSummary.employeeSpouseRateCurrent || 0,
            employeeChildRate: financialSummary.employeeChildrenRateCurrent || 0,
            familyRate: financialSummary.familyRateCurrent || 0,
            totalMonthly: calculatedTotals.currentTotal || 0,
            annualPremium: calculatedTotals.currentAnnualPremium || 0
          },
          renewal: {
            planName: planDetails.renewalPlan || "Renewal Plan",
            network: planDetails.renewalNetwork || "",
            medicalPlanOverview: planDetails.renewalPlanOverview || "",
            individualDeductible: deductibles.individualRenewal || 0,
            familyDeductible: deductibles.familyRenewal || 0,
            individualOutOfPocketMax: outOfPocket.individualRenewal || 0,
            familyOutOfPocketMax: outOfPocket.familyRenewal || 0,
            coinsurance: coinsuranceValues.renewal || 0,
            preventiveCare: `Covered ${coinsuranceValues.routineRenewal || 100}%`,
            primaryCare: formatFieldValue(primaryCare.renewalAmount, primaryCare.renewalText),
            specialist: formatFieldValue(specialist.renewalAmount, specialist.renewalType),
            inpatientHospital: formatFieldValue(inpatientHospitalization.renewalAmount, inpatientHospitalization.renewalType),
            outpatientSurgery: formatFieldValue(outpatientSurgery.renewalAmount, outpatientSurgery.renewalType),
            emergencyRoom: formatFieldValue(emergencyRoom.renewalAmount, emergencyRoom.renewalType),
            urgentCare: formatFieldValue(urgentCare.renewalAmount, urgentCare.renewalType),
            prescriptionRetail: formatPrescriptionValue(retailPrescription.renewal),
            employeeRate: financialSummary.employeeRateRenewal || 0,
            employeeSpouseRate: financialSummary.employeeSpouseRateRenewal || 0,
            employeeChildRate: financialSummary.employeeChildrenRateRenewal || 0,
            familyRate: financialSummary.familyRateRenewal || 0,
            totalMonthly: calculatedTotals.renewalTotal || 0,
            annualPremium: calculatedTotals.renewalAnnualPremium || 0,
            annualDollarDiff: calculatedTotals.annualDollarDiffRenewal || 0,
            annualPercentDiff: calculatedTotals.annualPercentDiffRenewal || 0
          },
          alternate: {
            planName: planDetails.alternatePlan || "Alternate Plan",
            network: planDetails.alternateNetwork || "",
            medicalPlanOverview: planDetails.alternatePlanOverview || "",
            individualDeductible: deductibles.individualAlternate || 0,
            familyDeductible: deductibles.familyAlternate || 0,
            individualOutOfPocketMax: outOfPocket.individualAlternate || 0,
            familyOutOfPocketMax: outOfPocket.familyAlternate || 0,
            coinsurance: coinsuranceValues.alternate || 0,
            preventiveCare: `Covered ${coinsuranceValues.routineAlternate || 100}%`,
            primaryCare: formatFieldValue(primaryCare.alternateAmount, primaryCare.alternateText),
            specialist: formatFieldValue(specialist.alternateAmount, specialist.alternateType),
            inpatientHospital: formatFieldValue(inpatientHospitalization.alternateAmount, inpatientHospitalization.alternateType),
            outpatientSurgery: formatFieldValue(outpatientSurgery.alternateAmount, outpatientSurgery.alternateType),
            emergencyRoom: formatFieldValue(emergencyRoom.alternateAmount, emergencyRoom.alternateType),
            urgentCare: formatFieldValue(urgentCare.alternateAmount, urgentCare.alternateType),
            prescriptionRetail: formatPrescriptionValue(retailPrescription.alternate),
            employeeRate: financialSummary.employeeRateAlternate || 0,
            employeeSpouseRate: financialSummary.employeeSpouseRateAlternate || 0,
            employeeChildRate: financialSummary.employeeChildrenRateAlternate || 0,
            familyRate: financialSummary.familyRateAlternate || 0,
            totalMonthly: calculatedTotals.alternateTotal || 0,
            annualPremium: calculatedTotals.alternateAnnualPremium || 0,
            annualDollarDiff: calculatedTotals.annualDollarDiffAlternate || 0,
            annualPercentDiff: calculatedTotals.annualPercentDiffAlternate || 0
          },
          alternate2: {
            planName: planDetails.fourthPlan || "Fourth Plan",
            network: planDetails.fourthNetwork || "",
            medicalPlanOverview: planDetails.fourthPlanOverview || "",
            individualDeductible: deductibles.individualFourth || 0,
            familyDeductible: deductibles.familyFourth || 0,
            individualOutOfPocketMax: outOfPocket.individualFourth || 0,
            familyOutOfPocketMax: outOfPocket.familyFourth || 0,
            coinsurance: coinsuranceValues.fourth || 0,
            preventiveCare: `Covered ${coinsuranceValues.routineFourth || 100}%`,
            primaryCare: formatFieldValue(primaryCare.fourthAmount, primaryCare.fourthText),
            specialist: formatFieldValue(specialist.fourthAmount, specialist.fourthType),
            inpatientHospital: formatFieldValue(inpatientHospitalization.fourthAmount, inpatientHospitalization.fourthType),
            outpatientSurgery: formatFieldValue(outpatientSurgery.fourthAmount, outpatientSurgery.fourthType),
            emergencyRoom: formatFieldValue(emergencyRoom.fourthAmount, emergencyRoom.fourthType),
            urgentCare: formatFieldValue(urgentCare.fourthAmount, urgentCare.fourthType),
            prescriptionRetail: formatPrescriptionValue(retailPrescription.fourth),
            employeeRate: financialSummary.employeeRateFourth || 0,
            employeeSpouseRate: financialSummary.employeeSpouseRateFourth || 0,
            employeeChildRate: financialSummary.employeeChildrenRateFourth || 0,
            familyRate: financialSummary.familyRateFourth || 0,
            totalMonthly: calculatedTotals.fourthTotal || 0,
            annualPremium: calculatedTotals.fourthAnnualPremium || 0,
            annualDollarDiff: calculatedTotals.annualDollarDiffFourth || 0,
            annualPercentDiff: calculatedTotals.annualPercentDiffFourth || 0
          }
        }
      };
    },

    // Method to get formatted data for second Excel mapping (F1, F2, H-K columns)
    getFormattedData2: () => {
      return {
        organizationName: { cell: "F1", type: "string", value: planDetails.organizationName },
        effectiveDate: { cell: "F2", type: "string", value: planDetails.effectiveDate },
        
        // Plans structure for second half - using columns H, I, J, K (4 plans total)
        plans: {
          current: {
            planName: { cell: "H5", type: "string", value: planDetails.currentPlan || "Current Plan" },
            network: { cell: "H7", type: "string", value: planDetails.currentNetwork || "" },
            medicalPlanOverview: { cell: "H8", type: "string", value: planDetails.currentPlanOverview || "" },
            employeeNumber: { cell: "G30", type: "number", value: financialSummary.employeeCount || 0 },
            employeeSpouseNumber: { cell: "G31", type: "number", value: financialSummary.employeeSpouseCount || 0 },
            employeeChildNumber: { cell: "G32", type: "number", value: financialSummary.employeeChildrenCount || 0 },
            familyNumber: { cell: "G33", type: "number", value: financialSummary.familyCount || 0 },
            individualDeductible: { cell: "H10", type: "number", value: deductibles.individualCurrent || 0 },
            familyDeductible: { cell: "H11", type: "number", value: deductibles.familyCurrent || 0 },
            individualOutOfPocketMax: { cell: "H13", type: "number", value: outOfPocket.individualCurrent || 0 },
            familyOutOfPocketMax: { cell: "H14", type: "number", value: outOfPocket.familyCurrent || 0 },
            coinsurance: { cell: "H15", type: "number", value: coinsuranceValues.current || 0 },
            preventiveCare: { cell: "H17", type: "string", value: `Covered ${coinsuranceValues.routineCurrent || 100}%` },
            primaryCare: { cell: "H18", type: "string", value: formatFieldValue(primaryCare.currentAmount, primaryCare.currentText) },
            specialist: { cell: "H19", type: "string", value: formatFieldValue(specialist.currentAmount, specialist.currentType) },
            inpatientHospital: { cell: "H21", type: "string", value: formatFieldValue(inpatientHospitalization.currentAmount, inpatientHospitalization.currentType) },
            outpatientSurgery: { cell: "H22", type: "string", value: formatFieldValue(outpatientSurgery.currentAmount, outpatientSurgery.currentType) },
            emergencyRoom: { cell: "H23", type: "string", value: formatFieldValue(emergencyRoom.currentAmount, emergencyRoom.currentType) },
            urgentCare: { cell: "H24", type: "string", value: formatFieldValue(urgentCare.currentAmount, urgentCare.currentType) },
            prescriptionRetail: { cell: "H26", type: "string", value: formatPrescriptionValue(retailPrescription.current) },
            employeeRate: { cell: "H30", type: "number", value: financialSummary.employeeRateCurrent || 0 },
            employeeSpouseRate: { cell: "H31", type: "number", value: financialSummary.employeeSpouseRateCurrent || 0 },
            employeeChildRate: { cell: "H32", type: "number", value: financialSummary.employeeChildrenRateCurrent || 0 },
            familyRate: { cell: "H33", type: "number", value: financialSummary.familyRateCurrent || 0 },
            totalMonthly: { cell: "H34", type: "number", value: calculatedTotals.currentTotal || 0 },
            annualPremium: { cell: "H36", type: "number", value: calculatedTotals.currentAnnualPremium || 0 }
          },
          renewal: {
            planName: { cell: "I5", type: "string", value: planDetails.renewalPlan || "Renewal Plan" },
            network: { cell: "I7", type: "string", value: planDetails.renewalNetwork || "" },
            medicalPlanOverview: { cell: "I8", type: "string", value: planDetails.renewalPlanOverview || "" },
            individualDeductible: { cell: "I10", type: "number", value: deductibles.individualRenewal || 0 },
            familyDeductible: { cell: "I11", type: "number", value: deductibles.familyRenewal || 0 },
            individualOutOfPocketMax: { cell: "I13", type: "number", value: outOfPocket.individualRenewal || 0 },
            familyOutOfPocketMax: { cell: "I14", type: "number", value: outOfPocket.familyRenewal || 0 },
            coinsurance: { cell: "I15", type: "number", value: coinsuranceValues.renewal || 0 },
            preventiveCare: { cell: "I17", type: "string", value: `Covered ${coinsuranceValues.routineRenewal || 100}%` },
            primaryCare: { cell: "I18", type: "string", value: formatFieldValue(primaryCare.renewalAmount, primaryCare.renewalText) },
            specialist: { cell: "I19", type: "string", value: formatFieldValue(specialist.renewalAmount, specialist.renewalType) },
            inpatientHospital: { cell: "I21", type: "string", value: formatFieldValue(inpatientHospitalization.renewalAmount, inpatientHospitalization.renewalType) },
            outpatientSurgery: { cell: "I22", type: "string", value: formatFieldValue(outpatientSurgery.renewalAmount, outpatientSurgery.renewalType) },
            emergencyRoom: { cell: "I23", type: "string", value: formatFieldValue(emergencyRoom.renewalAmount, emergencyRoom.renewalType) },
            urgentCare: { cell: "I24", type: "string", value: formatFieldValue(urgentCare.renewalAmount, urgentCare.renewalType) },
            prescriptionRetail: { cell: "I26", type: "string", value: formatPrescriptionValue(retailPrescription.renewal) },
            employeeRate: { cell: "I30", type: "number", value: financialSummary.employeeRateRenewal || 0 },
            employeeSpouseRate: { cell: "I31", type: "number", value: financialSummary.employeeSpouseRateRenewal || 0 },
            employeeChildRate: { cell: "I32", type: "number", value: financialSummary.employeeChildrenRateRenewal || 0 },
            familyRate: { cell: "I33", type: "number", value: financialSummary.familyRateRenewal || 0 },
            totalMonthly: { cell: "I34", type: "number", value: calculatedTotals.renewalTotal || 0 },
            annualPremium: { cell: "I36", type: "number", value: calculatedTotals.renewalAnnualPremium || 0 },
            annualDollarDiff: { cell: "I37", type: "number", value: calculatedTotals.annualDollarDiffRenewal || 0 },
            annualPercentDiff: { cell: "I38", type: "number", value: calculatedTotals.annualPercentDiffRenewal || 0 }
          },
          alternate: {
            planName: { cell: "J5", type: "string", value: planDetails.alternatePlan || "Alternate Plan" },
            network: { cell: "J7", type: "string", value: planDetails.alternateNetwork || "" },
            medicalPlanOverview: { cell: "J8", type: "string", value: planDetails.alternatePlanOverview || "" },
            individualDeductible: { cell: "J10", type: "number", value: deductibles.individualAlternate || 0 },
            familyDeductible: { cell: "J11", type: "number", value: deductibles.familyAlternate || 0 },
            individualOutOfPocketMax: { cell: "J13", type: "number", value: outOfPocket.individualAlternate || 0 },
            familyOutOfPocketMax: { cell: "J14", type: "number", value: outOfPocket.familyAlternate || 0 },
            coinsurance: { cell: "J15", type: "number", value: coinsuranceValues.alternate || 0 },
            preventiveCare: { cell: "J17", type: "string", value: `Covered ${coinsuranceValues.routineAlternate || 100}%` },
            primaryCare: { cell: "J18", type: "string", value: formatFieldValue(primaryCare.alternateAmount, primaryCare.alternateText) },
            specialist: { cell: "J19", type: "string", value: formatFieldValue(specialist.alternateAmount, specialist.alternateType) },
            inpatientHospital: { cell: "J21", type: "string", value: formatFieldValue(inpatientHospitalization.alternateAmount, inpatientHospitalization.alternateType) },
            outpatientSurgery: { cell: "J22", type: "string", value: formatFieldValue(outpatientSurgery.alternateAmount, outpatientSurgery.alternateType) },
            emergencyRoom: { cell: "J23", type: "string", value: formatFieldValue(emergencyRoom.alternateAmount, emergencyRoom.alternateType) },
            urgentCare: { cell: "J24", type: "string", value: formatFieldValue(urgentCare.alternateAmount, urgentCare.alternateType) },
            prescriptionRetail: { cell: "J26", type: "string", value: formatPrescriptionValue(retailPrescription.alternate) },
            employeeRate: { cell: "J30", type: "number", value: financialSummary.employeeRateAlternate || 0 },
            employeeSpouseRate: { cell: "J31", type: "number", value: financialSummary.employeeSpouseRateAlternate || 0 },
            employeeChildRate: { cell: "J32", type: "number", value: financialSummary.employeeChildrenRateAlternate || 0 },
            familyRate: { cell: "J33", type: "number", value: financialSummary.familyRateAlternate || 0 },
            totalMonthly: { cell: "J34", type: "number", value: calculatedTotals.alternateTotal || 0 },
            annualPremium: { cell: "J36", type: "number", value: calculatedTotals.alternateAnnualPremium || 0 },
            annualDollarDiff: { cell: "J37", type: "number", value: calculatedTotals.annualDollarDiffAlternate || 0 },
            annualPercentDiff: { cell: "J38", type: "number", value: calculatedTotals.annualPercentDiffAlternate || 0 }
          },
          // NEW: Fourth plan option in Column K
          alternate2: {
            planName: { cell: "K5", type: "string", value: planDetails.fourthPlan || "Fourth Plan" },
            network: { cell: "K7", type: "string", value: planDetails.fourthNetwork || "" },
            medicalPlanOverview: { cell: "K8", type: "string", value: planDetails.fourthPlanOverview || "" },
            individualDeductible: { cell: "K10", type: "number", value: deductibles.individualFourth || 0 },
            familyDeductible: { cell: "K11", type: "number", value: deductibles.familyFourth || 0 },
            individualOutOfPocketMax: { cell: "K13", type: "number", value: outOfPocket.individualFourth || 0 },
            familyOutOfPocketMax: { cell: "K14", type: "number", value: outOfPocket.familyFourth || 0 },
            coinsurance: { cell: "K15", type: "number", value: coinsuranceValues.fourth || 0 },
            preventiveCare: { cell: "K17", type: "string", value: `Covered ${coinsuranceValues.routineFourth || 100}%` },
            primaryCare: { cell: "K18", type: "string", value: formatFieldValue(primaryCare.fourthAmount, primaryCare.fourthText) },
            specialist: { cell: "K19", type: "string", value: formatFieldValue(specialist.fourthAmount, specialist.fourthType) },
            inpatientHospital: { cell: "K21", type: "string", value: formatFieldValue(inpatientHospitalization.fourthAmount, inpatientHospitalization.fourthType) },
            outpatientSurgery: { cell: "K22", type: "string", value: formatFieldValue(outpatientSurgery.fourthAmount, outpatientSurgery.fourthType) },
            emergencyRoom: { cell: "K23", type: "string", value: formatFieldValue(emergencyRoom.fourthAmount, emergencyRoom.fourthType) },
            urgentCare: { cell: "K24", type: "string", value: formatFieldValue(urgentCare.fourthAmount, urgentCare.fourthType) },
            prescriptionRetail: { cell: "K26", type: "string", value: formatPrescriptionValue(retailPrescription.fourth) },
            employeeRate: { cell: "K30", type: "number", value: financialSummary.employeeRateFourth || 0 },
            employeeSpouseRate: { cell: "K31", type: "number", value: financialSummary.employeeSpouseRateFourth || 0 },
            employeeChildRate: { cell: "K32", type: "number", value: financialSummary.employeeChildrenRateFourth || 0 },
            familyRate: { cell: "K33", type: "number", value: financialSummary.familyRateFourth || 0 },
            totalMonthly: { cell: "K34", type: "number", value: calculatedTotals.fourthTotal || 0 },
            annualPremium: { cell: "K36", type: "number", value: calculatedTotals.fourthAnnualPremium || 0 },
            annualDollarDiff: { cell: "K37", type: "number", value: calculatedTotals.annualDollarDiffFourth || 0 },
            annualPercentDiff: { cell: "K38", type: "number", value: calculatedTotals.annualPercentDiffFourth || 0 }
          }
        }
      };
    }
  }));

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

      // Notify parent component of changes
      onDataChange(formData);
    }, 1000); // 1 second debounce

    // Clear the timer on cleanup
    return () => clearTimeout(timer);
  }, [
    planDetails, deductibles, outOfPocket, coinsuranceValues,
    primaryCare, specialist, inpatientHospitalization,
    outpatientSurgery, emergencyRoom, urgentCare, retailPrescription,
    financialSummary, calculatedTotals, onDataChange
  ]);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
          !event.target.closest('button[type="button"]')) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">

      {/* Organization and Effective Date */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 bg-white shadow-sm mb-4 rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <label htmlFor="organizationName2" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h6v2H7v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="organizationName2"
                className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                value={planDetails.organizationName}
                onChange={(e) => handleTextInputChange('organizationName', e.target.value)}
                placeholder="Enter organization name"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="effectiveDate2" className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="effectiveDate2"
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

              {/* Custom Calendar Dropdown - Same as original */}
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
        <div className="grid grid-cols-5 gap-4">
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
          <div className="col-span-1 bg-indigo-700 text-white p-3 rounded-t-lg font-medium text-center">
            <textarea
              className="w-full bg-transparent border-0 text-white text-center resize-none focus:ring-2 focus:ring-white py-1"
              rows="3"
              value={planDetails.fourthPlan}
              onChange={(e) => handleTextInputChange('fourthPlan', e.target.value)}
              placeholder="Fourth Plan Details"
            ></textarea>
          </div>
        </div>

        {/* Rest of the form structure identical to original MedUHCTab */}
        {/* Network Banner */}
        <div className="grid grid-cols-5 gap-4 mt-2">
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
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.fourthNetwork}
              onChange={(e) => handleTextInputChange('fourthNetwork', e.target.value)}
              placeholder="Insert Network Name"
            />
          </div>
        </div>
 {/* Medical Plan Overview */}
        <div className="grid grid-cols-5 gap-4 mt-2">
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
          <div className="col-span-1 bg-indigo-100 text-indigo-800 p-2 text-center">
            <input
              type="text"
              className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
              value={planDetails.fourthPlanOverview}
              onChange={(e) => handleTextInputChange('fourthPlanOverview', e.target.value)}
              placeholder="In Network Benefits"
            />
          </div>
        </div>

        {/* Annual Deductible Section */}
        <div className="grid grid-cols-5 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            ANNUAL DEDUCTIBLE
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Deductible Individual Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Individual
          </div>
          <div className={CSS_CLASSES.inputCell}>
            <div className="relative">
              <span className={CSS_CLASSES.dollarIcon}>$</span>
              <input
                type="number"
                value={deductibles.individualCurrent}
                onChange={(e) => handleDeductibleChange('individualCurrent', Number(e.target.value))}
                placeholder="0"
                className={`${CSS_CLASSES.numberInput} placeholder:text-slate-400`}
              />
            </div>
          </div>
          <div className={CSS_CLASSES.inputCell}>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={deductibles.individualRenewal}
                onChange={(e) => handleDeductibleChange('individualRenewal', Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={deductibles.individualAlternate}
                onChange={(e) => handleDeductibleChange('individualAlternate', Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={deductibles.individualFourth}
                onChange={(e) => handleDeductibleChange('individualFourth', Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Deductible Family Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Family
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={deductibles.familyCurrent}
                onChange={(e) => handleDeductibleChange('familyCurrent', Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={deductibles.familyRenewal}
                onChange={(e) => handleDeductibleChange('familyRenewal', Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={deductibles.familyAlternate}
                onChange={(e) => handleDeductibleChange('familyAlternate', Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={deductibles.familyFourth}
                onChange={(e) => handleDeductibleChange('familyFourth', Number(e.target.value))}
                placeholder="0"
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Annual Maximum Out of Pocket Section */}
        <div className="grid grid-cols-5 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            ANNUAL MAXIMUM OUT OF POCKET
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Out of Pocket Individual Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Individual
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.individualCurrent}
                onChange={(e) => handleOutOfPocketChange('individualCurrent', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.individualRenewal}
                onChange={(e) => handleOutOfPocketChange('individualRenewal', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.individualAlternate}
                onChange={(e) => handleOutOfPocketChange('individualAlternate', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.individualFourth}
                onChange={(e) => handleOutOfPocketChange('individualFourth', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Out of Pocket Family Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Family
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.familyCurrent}
                onChange={(e) => handleOutOfPocketChange('familyCurrent', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.familyRenewal}
                onChange={(e) => handleOutOfPocketChange('familyRenewal', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.familyAlternate}
                onChange={(e) => handleOutOfPocketChange('familyAlternate', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={outOfPocket.familyFourth}
                onChange={(e) => handleOutOfPocketChange('familyFourth', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Coinsurance Row with Independent Sliders */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Coinsurance
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={coinsuranceValues.current}
                onChange={(e) => handleSliderChange('current', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 min-w-[40px] text-center">{coinsuranceValues.current}%</span>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={coinsuranceValues.renewal}
                onChange={(e) => handleSliderChange('renewal', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 min-w-[40px] text-center">{coinsuranceValues.renewal}%</span>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={coinsuranceValues.alternate}
                onChange={(e) => handleSliderChange('alternate', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 min-w-[40px] text-center">{coinsuranceValues.alternate}%</span>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={coinsuranceValues.fourth}
                onChange={(e) => handleSliderChange('fourth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-2 min-w-[40px] text-center">{coinsuranceValues.fourth}%</span>
            </div>
          </div>
        </div>

        {/* Physician Visits Section */}
        <div className="grid grid-cols-5 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            PHYSICIAN VISITS
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Routine Preventive Row with Percentage Sliders */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Routine Preventive
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="text-center font-medium">Covered at {coinsuranceValues.routineCurrent}%</div>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={coinsuranceValues.routineCurrent}
                  onChange={(e) => handleSliderChange('routineCurrent', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="text-center font-medium">Covered at {coinsuranceValues.routineRenewal}%</div>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={coinsuranceValues.routineRenewal}
                  onChange={(e) => handleSliderChange('routineRenewal', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="text-center font-medium">Covered at {coinsuranceValues.routineAlternate}%</div>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={coinsuranceValues.routineAlternate}
                  onChange={(e) => handleSliderChange('routineAlternate', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="text-center font-medium">Covered at {coinsuranceValues.routineFourth}%</div>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={coinsuranceValues.routineFourth}
                  onChange={(e) => handleSliderChange('routineFourth', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Care Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Primary Care
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={primaryCare.currentAmount}
                  onChange={(e) => handlePrimaryCareChange('currentAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
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
                  type="number"
                  value={primaryCare.renewalAmount}
                  onChange={(e) => handlePrimaryCareChange('renewalAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
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
                  type="number"
                  value={primaryCare.alternateAmount}
                  onChange={(e) => handlePrimaryCareChange('alternateAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
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
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={primaryCare.fourthAmount}
                  onChange={(e) => handlePrimaryCareChange('fourthAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <input
                type="text"
                value={primaryCare.fourthText}
                onChange={(e) => handlePrimaryCareChange('fourthText', e.target.value)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        {/* Specialist Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Specialist
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={specialist.currentAmount}
                  onChange={(e) => handleSpecialistChange('currentAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={specialist.currentType}
                onChange={(e) => handleDropdownChange('specialist', 'currentType', e)}
                className={CSS_CLASSES.dropdown}
              >
                {TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={specialist.renewalAmount}
                  onChange={(e) => handleSpecialistChange('renewalAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={specialist.renewalType}
                onChange={(e) => handleDropdownChange('specialist', 'renewalType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={specialist.alternateAmount}
                  onChange={(e) => handleSpecialistChange('alternateAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={specialist.alternateType}
                onChange={(e) => handleDropdownChange('specialist', 'alternateType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={specialist.fourthAmount}
                  onChange={(e) => handleSpecialistChange('fourthAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={specialist.fourthType}
                onChange={(e) => handleDropdownChange('specialist', 'fourthType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        <div className="grid grid-cols-5 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            HOSPITAL SERVICES
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Inpatient Hospitalization Row with Number Input and Dropdown */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Inpatient Hospitalization
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={inpatientHospitalization.currentAmount}
                  onChange={(e) => handleInpatientHospitalizationChange('currentAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={inpatientHospitalization.currentType}
                onChange={(e) => handleDropdownChange('inpatientHospitalization', 'currentType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={inpatientHospitalization.renewalAmount}
                  onChange={(e) => handleInpatientHospitalizationChange('renewalAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={inpatientHospitalization.renewalType}
                onChange={(e) => handleDropdownChange('inpatientHospitalization', 'renewalType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={inpatientHospitalization.alternateAmount}
                  onChange={(e) => handleInpatientHospitalizationChange('alternateAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={inpatientHospitalization.alternateType}
                onChange={(e) => handleDropdownChange('inpatientHospitalization', 'alternateType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={inpatientHospitalization.fourthAmount}
                  onChange={(e) => handleInpatientHospitalizationChange('fourthAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={inpatientHospitalization.fourthType}
                onChange={(e) => handleDropdownChange('inpatientHospitalization', 'fourthType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Outpatient Surgery Row with Number Input and Dropdown */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Outpatient Surgery
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={outpatientSurgery.currentAmount}
                  onChange={(e) => handleOutpatientSurgeryChange('currentAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={outpatientSurgery.currentType}
                onChange={(e) => handleDropdownChange('outpatientSurgery', 'currentType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={outpatientSurgery.renewalAmount}
                  onChange={(e) => handleOutpatientSurgeryChange('renewalAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={outpatientSurgery.renewalType}
                onChange={(e) => handleDropdownChange('outpatientSurgery', 'renewalType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={outpatientSurgery.alternateAmount}
                  onChange={(e) => handleOutpatientSurgeryChange('alternateAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={outpatientSurgery.alternateType}
                onChange={(e) => handleDropdownChange('outpatientSurgery', 'alternateType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={outpatientSurgery.fourthAmount}
                  onChange={(e) => handleOutpatientSurgeryChange('fourthAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={outpatientSurgery.fourthType}
                onChange={(e) => handleDropdownChange('outpatientSurgery', 'fourthType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Emergency Room Visit
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={emergencyRoom.currentAmount}
                  onChange={(e) => handleEmergencyRoomChange('currentAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={emergencyRoom.currentType}
                onChange={(e) => handleDropdownChange('emergencyRoom', 'currentType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={emergencyRoom.renewalAmount}
                  onChange={(e) => handleEmergencyRoomChange('renewalAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={emergencyRoom.renewalType}
                onChange={(e) => handleDropdownChange('emergencyRoom', 'renewalType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={emergencyRoom.alternateAmount}
                  onChange={(e) => handleEmergencyRoomChange('alternateAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={emergencyRoom.alternateType}
                onChange={(e) => handleDropdownChange('emergencyRoom', 'alternateType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={emergencyRoom.fourthAmount}
                  onChange={(e) => handleEmergencyRoomChange('fourthAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={emergencyRoom.fourthType}
                onChange={(e) => handleDropdownChange('emergencyRoom', 'fourthType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Urgent Care Visit
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={urgentCare.currentAmount}
                  onChange={(e) => handleUrgentCareChange('currentAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={urgentCare.currentType}
                onChange={(e) => handleDropdownChange('urgentCare', 'currentType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={urgentCare.renewalAmount}
                  onChange={(e) => handleUrgentCareChange('renewalAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={urgentCare.renewalType}
                onChange={(e) => handleDropdownChange('urgentCare', 'renewalType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={urgentCare.alternateAmount}
                  onChange={(e) => handleUrgentCareChange('alternateAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={urgentCare.alternateType}
                onChange={(e) => handleDropdownChange('urgentCare', 'alternateType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <option value="">Select type</option>
                <option value="Copay">Copay</option>
                <option value="Deductible">Deductible</option>
                <option value="Copay + Deductible">Copay + Deductible</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={urgentCare.fourthAmount}
                  onChange={(e) => handleUrgentCareChange('fourthAmount', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <select
                value={urgentCare.fourthType}
                onChange={(e) => handleDropdownChange('urgentCare', 'fourthType', e)}
                className="block w-full rounded-md border-0 py-2 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        <div className="grid grid-cols-5 gap-4 mt-2">
          <div className="col-span-1 bg-sky-600 text-white p-2 font-medium">
            PRESCRIPTION DRUG BENEFIT
          </div>
          <div className="col-span-3"></div>
        </div>

        {/* Retail Row - With 4 Separate Input Boxes */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">
            Retail
          </div>
          {/* Current Plan */}
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.current.tier1}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier1', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.current.tier2}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier2', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.current.tier3}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier3', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.current.tier4}
                  onChange={(e) => handleRetailPrescriptionChange('current', 'tier4', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
            </div>
          </div>

          {/* Renewal Plan */}
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.renewal.tier1}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier1', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.renewal.tier2}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier2', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.renewal.tier3}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier3', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.renewal.tier4}
                  onChange={(e) => handleRetailPrescriptionChange('renewal', 'tier4', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
            </div>
          </div>

          {/* Alternate Plan */}
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.alternate.tier1}
                  onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier1', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.alternate.tier2}
                  onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier2', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.alternate.tier3}
                  onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier3', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.alternate.tier4}
                  onChange={(e) => handleRetailPrescriptionChange('alternate', 'tier4', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
            </div>
          </div>

          {/* Fourth Plan */}
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="flex items-center justify-center space-x-1">
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.fourth.tier1}
                  onChange={(e) => handleRetailPrescriptionChange('fourth', 'tier1', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.fourth.tier2}
                  onChange={(e) => handleRetailPrescriptionChange('fourth', 'tier2', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.fourth.tier3}
                  onChange={(e) => handleRetailPrescriptionChange('fourth', 'tier3', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
              <span className="text-slate-400">/</span>
              <div className="relative w-16">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">$</span>
                <input
                  type="number"
                  value={retailPrescription.fourth.tier4}
                  onChange={(e) => handleRetailPrescriptionChange('fourth', 'tier4', Number(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 pl-6 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary Section */}
        <div className="grid grid-cols-5 gap-4 mt-6">
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
          <div className="col-span-1 text-center bg-indigo-100 p-2 text-indigo-800 font-medium">
            Fourth Rates
          </div>
        </div>

        {/* Employee Row - With Editable Count (MOVED TO THE TOP) */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium flex justify-between">
            <span>Employee</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="number"
                value={financialSummary.employeeCount}
                onChange={(e) => handleFinancialSummaryChange('employeeCount', Number(e.target.value))}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('employeeRateCurrent', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('employeeRateRenewal', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('employeeRateAlternate', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeRateFourth}
                onChange={(e) => handleFinancialSummaryChange('employeeRateFourth', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
        </div>

        {/* Employee + Spouse Row - With Editable Count */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Employee + Spouse</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="number"
                value={financialSummary.employeeSpouseCount}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseCount', Number(e.target.value))}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeSpouseRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseRateCurrent', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeSpouseRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseRateRenewal', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeSpouseRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseRateAlternate', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeSpouseRateFourth}
                onChange={(e) => handleFinancialSummaryChange('employeeSpouseRateFourth', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
        </div>

        {/* Employee + Child(ren) Row - With Editable Count */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Employee + Child(ren)</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="number"
                value={financialSummary.employeeChildrenCount}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenCount', Number(e.target.value))}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeChildrenRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenRateCurrent', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeChildrenRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenRateRenewal', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeChildrenRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenRateAlternate', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.employeeChildrenRateFourth}
                onChange={(e) => handleFinancialSummaryChange('employeeChildrenRateFourth', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
        </div>

        {/* Family Row - With Editable Count */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Family</span>
            <div className="text-indigo-600 font-medium border border-slate-200">
              <input
                type="number"
                value={financialSummary.familyCount}
                onChange={(e) => handleFinancialSummaryChange('familyCount', Number(e.target.value))}
                className="ring-slate-200 w-12 text-center bg-transparent border-0 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.familyRateCurrent}
                onChange={(e) => handleFinancialSummaryChange('familyRateCurrent', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.familyRateRenewal}
                onChange={(e) => handleFinancialSummaryChange('familyRateRenewal', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.familyRateAlternate}
                onChange={(e) => handleFinancialSummaryChange('familyRateAlternate', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
          <div className="col-span-1 p-2 bg-white border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="number"
                value={financialSummary.familyRateFourth}
                onChange={(e) => handleFinancialSummaryChange('familyRateFourth', Number(e.target.value))}
                className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
              />
            </div>
          </div>
        </div>

        {/* Totals Row - Made Uneditable */}
        <div className="grid grid-cols-5 gap-4">
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
          <div className="col-span-1 p-2 bg-slate-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.fourthTotal)}
                disabled
                className="bg-slate-100 block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
        </div>

        {/* Total Annual Premium - Made Uneditable */}
        <div className="grid grid-cols-5 gap-4 mt-2">
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
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.fourthAnnualPremium)}
                disabled
                className="bg-indigo-100 block w-full rounded-md border-0 py-2 pl-8 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
        </div>

        {/* Total Annual Dollar Difference Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 bg-indigo-700 text-white p-2 font-medium">
            Total Annual $ Difference
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200">
            <div className="text-center text-indigo-800 font-medium">

            </div>
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</span>
              <input
                type="text"
                value={formatNumberWithCommas(calculatedTotals.annualDollarDiffRenewal)}
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
                value={formatNumberWithCommas(calculatedTotals.annualDollarDiffAlternate)}
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
                value={formatNumberWithCommas(calculatedTotals.annualDollarDiffFourth)}
                disabled
                className="bg-indigo-100 block w-full rounded-md border-0 py-2 pl-8 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
            </div>
          </div>
        </div>

        {/* Total Annual Percent Difference Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 bg-indigo-700 text-white p-2 font-medium">
            Total Annual % Difference
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200">
            <div className="text-center text-indigo-800 font-medium">

            </div>
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200 text-center">
            <div className="flex items-center justify-center">
              <input
                type="number"
                value={calculatedTotals.annualPercentDiffRenewal}
                disabled
                step="0.01"
                className="w-20 rounded-md border-0 py-2 bg-indigo-100 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
              <span className="ml-1 text-indigo-800 font-medium">%</span>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200 text-center">
            <div className="flex items-center justify-center">
              <input
                type="number"
                value={calculatedTotals.annualPercentDiffAlternate}
                disabled
                step="0.01"
                className="w-20 rounded-md border-0 py-2 bg-indigo-100 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
              <span className="ml-1 text-indigo-800 font-medium">%</span>
            </div>
          </div>
          <div className="col-span-1 p-2 bg-indigo-100 border border-slate-200 text-center">
            <div className="flex items-center justify-center">
              <input
                type="number"
                value={calculatedTotals.annualPercentDiffFourth}
                disabled
                step="0.01"
                className="w-20 rounded-md border-0 py-2 bg-indigo-100 text-indigo-800 font-medium ring-1 ring-inset ring-slate-200 cursor-not-allowed text-center"
              />
              <span className="ml-1 text-indigo-800 font-medium">%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

// Set display name for debugging purposes
MedUHC2Tab.displayName = 'MedUHC2Tab';

export default MedUHC2Tab;

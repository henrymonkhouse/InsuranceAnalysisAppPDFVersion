// Types for the booklet system

export interface BookletMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  completionStatus: {
    [tabId: string]: boolean;
  };
  selectedTabs: string[];
}

export interface Booklet {
  metadata: BookletMetadata;
  data: BookletData;
}

export interface BookletData {
  sharedDetails: {
    organizationName: string;
    effectiveDate: string;
  };
  tabs: {
    [tabId: string]: any; // Will be typed more specifically later
  };
}

export interface BookletListItem {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
  completionPercentage: number;
}

export interface SaveBookletRequest {
  name: string;
  description?: string;
  data: BookletData;
  selectedTabs: string[];
}

export interface UpdateBookletRequest {
  id: string;
  name?: string;
  description?: string;
  data?: BookletData;
  selectedTabs?: string[];
}

export type TabId = 'medUHC' | 'medUHC2' | 'medUHCTrustmark' | 'dental' | 'vision' | 'gtl' | 'volLife' | 'vltd' | 'cobra';

export interface TabMetadata {
  id: TabId;
  label: string;
  description: string;
  icon?: string;
  order: number;
}

export const AVAILABLE_TABS: TabMetadata[] = [
  { id: 'medUHC', label: 'Med UHC', description: 'Medical UHC Plan Details', order: 1 },
  { id: 'medUHC2', label: 'Med UHC 2', description: 'Medical UHC Alternative Plan', order: 2 },
  { id: 'medUHCTrustmark', label: 'Med UHC Trustmark', description: 'Medical UHC Trustmark Plan', order: 3 },
  { id: 'dental', label: 'Dental', description: 'Dental Coverage Details', order: 4 },
  { id: 'vision', label: 'Vision', description: 'Vision Coverage Details', order: 5 },
  { id: 'gtl', label: 'GTL', description: 'Group Term Life Insurance', order: 6 },
  { id: 'volLife', label: 'Vol Life', description: 'Voluntary Life Insurance', order: 7 },
  { id: 'vltd', label: 'VLTD', description: 'Voluntary Long Term Disability', order: 8 },
  { id: 'cobra', label: 'COBRA', description: 'COBRA Coverage Information', order: 9 },
  // Placeholder for future tabs
  { id: 'std' as any, label: 'STD', description: 'Short Term Disability', order: 10 },
  { id: 'ltd' as any, label: 'LTD', description: 'Long Term Disability', order: 11 },
  { id: 'accident' as any, label: 'Accident', description: 'Accident Insurance', order: 12 },
  { id: 'criticalIllness' as any, label: 'Critical Illness', description: 'Critical Illness Coverage', order: 13 },
  { id: 'hospital' as any, label: 'Hospital', description: 'Hospital Indemnity', order: 14 },
  { id: 'hsaFsa' as any, label: 'HSA/FSA', description: 'Health Savings/Flexible Spending Accounts', order: 15 },
];
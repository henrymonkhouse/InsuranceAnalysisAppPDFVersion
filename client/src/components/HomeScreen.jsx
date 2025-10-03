import { useState, useEffect } from 'react';
import bookletApi from '../services/bookletApi';

// Dummy data for demo
const DUMMY_BOOKLETS = [
  {
    id: 'dummy-1',
    name: '2024 Employee Benefits Package',
    description: 'Complete benefits analysis for all employees',
    updatedAt: '2024-01-15T10:30:00Z',
    completionPercentage: 85
  },
  {
    id: 'dummy-2', 
    name: 'Executive Benefits Review',
    description: 'High-level benefits for executive team',
    updatedAt: '2024-01-10T14:20:00Z',
    completionPercentage: 60
  },
  {
    id: 'dummy-3',
    name: 'Q1 2024 Benefits Analysis',
    description: 'Quarterly review of benefits costs and coverage',
    updatedAt: '2024-01-05T09:15:00Z', 
    completionPercentage: 100
  },
  {
    id: 'dummy-4',
    name: 'New Hire Benefits Onboarding',
    description: 'Benefits package for new employees starting Q2',
    updatedAt: '2023-12-28T16:45:00Z',
    completionPercentage: 40
  },
  {
    id: 'dummy-5',
    name: 'Remote Worker Benefits',
    description: 'Special benefits consideration for remote workforce',
    updatedAt: '2023-12-20T11:30:00Z',
    completionPercentage: 75
  }
];

// Complete tab list as specified
const ALL_TABS = [
  { id: 'medFullyInsured', label: 'Med - Fully Insured / Level', icon: '🏥', available: true },
  { id: 'medSelfFunded', label: 'Med – Self-Funded', icon: '🏥', available: false },
  { id: 'dental', label: 'Dental', icon: '🦷', available: true },
  { id: 'vision', label: 'Vision', icon: '👁️', available: true },
  { id: 'gtl', label: 'GTL', icon: '🛡️', available: true },
  { id: 'volLife', label: 'Vol Life', icon: '💚', available: true },
  { id: 'vltd', label: 'VLTD', icon: '🦽', available: true },
  { id: 'vstd', label: 'VSTD', icon: '📋', available: false },
  { id: 'erLtd', label: 'ER LTD', icon: '📄', available: false },
  { id: 'erStd', label: 'ER STD', icon: '📋', available: false },
  { id: 'vci', label: 'VCI', icon: '❤️', available: false },
  { id: 'erci', label: 'ERCI', icon: '❤️', available: false },
  { id: 'vhos', label: 'VHOS', icon: '🏨', available: false },
  { id: 'erhos', label: 'ERHOS', icon: '🏨', available: false },
  { id: 'teleMed', label: 'TeleMed', icon: '📱', available: false },
  { id: 'cobra', label: 'COBRA', icon: '🐍', available: true },
];

const HomeScreen = ({ onOpenBooklet, onCreateBooklet }) => {
  const [booklets, setBooklets] = useState(DUMMY_BOOKLETS);
  const [filteredBooklets, setFilteredBooklets] = useState(DUMMY_BOOKLETS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookletName, setNewBookletName] = useState('');
  const [newBookletDescription, setNewBookletDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [selectedTabs, setSelectedTabs] = useState(new Set());
  const [selectedBooklet, setSelectedBooklet] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load booklets on mount (using dummy data for now)
  useEffect(() => {
    // loadBooklets(); // Commented out to use dummy data
    setLoading(false);
  }, []);

  // Filter booklets based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBooklets(booklets);
    } else {
      const filtered = booklets.filter(booklet => 
        booklet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booklet.description && booklet.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBooklets(filtered);
    }
  }, [searchTerm, booklets]);

  const loadBooklets = async () => {
    try {
      setLoading(true);
      const data = await bookletApi.getAllBooklets();
      setBooklets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooklet = async () => {
    if (!newBookletName.trim() || !companyName.trim() || !effectiveDate || selectedTabs.size === 0) {
      setError('Please fill in all required fields and select at least one tab');
      return;
    }

    try {
      const newBooklet = await bookletApi.createBooklet({
        name: newBookletName,
        description: newBookletDescription,
        selectedTabs: Array.from(selectedTabs),
        data: {
          sharedDetails: {
            organizationName: companyName,
            effectiveDate: effectiveDate,
            companyLogo: companyLogo // Store logo data if uploaded
          },
          tabs: {}
        }
      });
      
      // Reset form
      setShowCreateModal(false);
      setNewBookletName('');
      setNewBookletDescription('');
      setCompanyName('');
      setEffectiveDate('');
      setCompanyLogo(null);
      setSelectedTabs(new Set());
      setError(null);
      
      // Open the new booklet
      onCreateBooklet(newBooklet);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a PNG or JPEG image');
    }
  };

  const toggleTab = (tabId) => {
    const newSelected = new Set(selectedTabs);
    if (newSelected.has(tabId)) {
      newSelected.delete(tabId);
    } else {
      newSelected.add(tabId);
    }
    setSelectedTabs(newSelected);
  };

  const selectAllTabs = () => {
    const availableTabs = ALL_TABS.filter(tab => tab.available).map(tab => tab.id);
    setSelectedTabs(new Set(availableTabs));
  };

  const clearAllTabs = () => {
    setSelectedTabs(new Set());
  };

  const resetCreateModal = () => {
    setShowCreateModal(false);
    setNewBookletName('');
    setNewBookletDescription('');
    setCompanyName('');
    setEffectiveDate('');
    setCompanyLogo(null);
    setSelectedTabs(new Set());
    setError(null);
  };

  const handleDeleteBooklet = async () => {
    if (!selectedBooklet) return;

    try {
      await bookletApi.deleteBooklet(selectedBooklet.id);
      await loadBooklets();
      setShowDeleteConfirm(false);
      setSelectedBooklet(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDuplicateBooklet = async (booklet) => {
    try {
      const duplicated = await bookletApi.duplicateBooklet(booklet.id);
      await loadBooklets();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Header/Navbar */}
      <header className="bg-gradient-to-r from-white to-gray-50 shadow-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-8 px-6">
            {/* Left side - Logo and branding */}
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={process.env.PUBLIC_URL + "/images/Cornerstone-Logo.png"}
                  alt="Cornerstone Insurance Group Logo"
                  className="h-20 w-auto mr-8 transform hover:scale-105 transition-all duration-300 drop-shadow-lg"
                />
              </div>
              <div className="border-l-2 border-indigo-200 pl-6">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none" style={{fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif'}}>
                  Insurance Benefits
                  <span className="block text-2xl font-semibold text-indigo-600 mt-1">
                    Management Suite
                  </span>
                </h1>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                    <p className="text-gray-600 font-medium text-sm" style={{fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif'}}>
                      Create & Manage PDF Booklets
                    </p>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-semibold uppercase tracking-wide">
                    Professional
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Navigation/Actions */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">System Online</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{booklets.length} Booklets</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">CG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Create New Booklet Button - Extra Large rounded "+" */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-48 h-48 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-3xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center group"
          >
            <svg className="w-24 h-24 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="text-center mb-8">
          <p className="text-gray-600 font-medium">Create New Booklet</p>
        </div>

        {/* Search Bar - Full Width */}
        <div className="mb-6">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              placeholder="Search booklets..."
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Scrollable Booklets Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Booklets ({filteredBooklets.length})
            </h2>
          </div>
          
          <div className="h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading booklets...</span>
              </div>
            ) : filteredBooklets.length === 0 ? (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No booklets found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
                  </>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No booklets yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Create your first booklet to get started.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredBooklets.map((booklet) => (
                  <div
                    key={booklet.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={() => onOpenBooklet(booklet.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          {booklet.name}
                        </h3>
                        {booklet.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{booklet.description}</p>
                        )}
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>Updated {formatDate(booklet.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-4">
                        {/* Progress Bar */}
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                booklet.completionPercentage === 100 
                                  ? 'bg-green-500' 
                                  : booklet.completionPercentage >= 70 
                                    ? 'bg-indigo-600' 
                                    : 'bg-yellow-500'
                              }`}
                              style={{ width: `${booklet.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-8">
                            {booklet.completionPercentage}%
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateBooklet(booklet);
                            }}
                            className="text-xs text-gray-500 hover:text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooklet(booklet);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal - Comprehensive */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl leading-6 font-bold text-gray-900">Create New Benefits Booklet</h3>
              <p className="mt-1 text-sm text-gray-600">Fill in the company details and select the sections to include</p>
            </div>
            
            <div className="px-6 py-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Company Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h4>
                    
                    {/* Booklet Name */}
                    <div className="mb-4">
                      <label htmlFor="booklet-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Booklet Name *
                      </label>
                      <input
                        type="text"
                        id="booklet-name"
                        value={newBookletName}
                        onChange={(e) => setNewBookletName(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 2024 Employee Benefits"
                        autoFocus
                      />
                    </div>

                    {/* Company Name */}
                    <div className="mb-4">
                      <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="company-name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter company name"
                      />
                    </div>

                    {/* Effective Date */}
                    <div className="mb-4">
                      <label htmlFor="effective-date" className="block text-sm font-medium text-gray-700 mb-2">
                        Effective Date *
                      </label>
                      <input
                        type="date"
                        id="effective-date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Company Logo Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo (PNG/JPEG)
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-400 transition-colors">
                        <div className="space-y-1 text-center">
                          {companyLogo ? (
                            <div className="mb-4">
                              <img src={companyLogo} alt="Company Logo Preview" className="mx-auto h-24 w-24 object-contain rounded-md" />
                              <button
                                type="button"
                                onClick={() => setCompanyLogo(null)}
                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                              >
                                Remove Logo
                              </button>
                            </div>
                          ) : (
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>Upload a logo</span>
                              <input 
                                id="logo-upload" 
                                name="logo-upload" 
                                type="file" 
                                className="sr-only" 
                                accept=".png,.jpg,.jpeg"
                                onChange={handleLogoUpload}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="booklet-description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        id="booklet-description"
                        value={newBookletDescription}
                        onChange={(e) => setNewBookletDescription(e.target.value)}
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Add any notes about this booklet..."
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Tab Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Select Sections *</h4>
                    <div className="text-sm text-gray-600">
                      {selectedTabs.size} of {ALL_TABS.filter(tab => tab.available).length} selected
                    </div>
                  </div>
                  
                  {/* Select All/Clear Buttons */}
                  <div className="flex space-x-3 mb-4">
                    <button
                      type="button"
                      onClick={selectAllTabs}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Select All Available
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={clearAllTabs}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Scrollable Tab List */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="max-h-80 overflow-y-auto p-4 space-y-2">
                      {ALL_TABS.map((tab) => (
                        <div
                          key={tab.id}
                          className={`
                            flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                            ${!tab.available 
                              ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' 
                              : selectedTabs.has(tab.id)
                                ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                          onClick={() => tab.available && toggleTab(tab.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{tab.icon}</span>
                              <div>
                                <h5 className={`font-medium ${tab.available ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {tab.label}
                                </h5>
                                {!tab.available && (
                                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                                    Coming Soon
                                  </span>
                                )}
                              </div>
                            </div>
                            {tab.available && (
                              <div className={`
                                w-5 h-5 rounded border-2 flex items-center justify-center
                                ${selectedTabs.has(tab.id) 
                                  ? 'border-indigo-500 bg-indigo-500' 
                                  : 'border-gray-300 bg-white'
                                }
                              `}>
                                {selectedTabs.has(tab.id) && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetCreateModal}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBooklet}
                disabled={!newBookletName.trim() || !companyName.trim() || !effectiveDate || selectedTabs.size === 0}
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Booklet ({selectedTabs.size} sections)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedBooklet && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Booklet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete "{selectedBooklet.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDeleteBooklet}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedBooklet(null);
                }}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
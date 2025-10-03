import React, { createContext, useState, useContext, useEffect } from 'react';
import bookletApi from '../services/bookletApi';

const BookletContext = createContext();

export const BookletProvider = ({ children }) => {
  const [currentBooklet, setCurrentBooklet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load a booklet by ID
  const loadBooklet = async (bookletId) => {
    try {
      setLoading(true);
      setError(null);
      const booklet = await bookletApi.getBooklet(bookletId);
      setCurrentBooklet(booklet);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new booklet
  const createBooklet = async (bookletData) => {
    try {
      setLoading(true);
      setError(null);
      const booklet = await bookletApi.createBooklet(bookletData);
      setCurrentBooklet(booklet);
      setHasUnsavedChanges(false);
      return booklet;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update the current booklet
  const updateBooklet = async (updates) => {
    if (!currentBooklet) return;

    try {
      setError(null);
      const updatedBooklet = await bookletApi.updateBooklet(currentBooklet.metadata.id, updates);
      setCurrentBooklet(updatedBooklet);
      setHasUnsavedChanges(false);
      return updatedBooklet;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update tab data
  const updateTabData = async (tabId, data) => {
    if (!currentBooklet) return;

    try {
      setError(null);
      const updatedBooklet = await bookletApi.updateTabData(
        currentBooklet.metadata.id,
        tabId,
        data
      );
      setCurrentBooklet(updatedBooklet);
      setHasUnsavedChanges(false);
      return updatedBooklet;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update local state (without saving)
  const updateLocalTabData = (tabId, data) => {
    if (!currentBooklet) return;

    setCurrentBooklet(prev => ({
      ...prev,
      data: {
        ...prev.data,
        tabs: {
          ...prev.data.tabs,
          [tabId]: data
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Save all changes
  const saveAllChanges = async () => {
    if (!currentBooklet || !hasUnsavedChanges) return;

    try {
      await updateBooklet({
        data: currentBooklet.data
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      throw err;
    }
  };

  // Clear the current booklet
  const clearBooklet = () => {
    setCurrentBooklet(null);
    setHasUnsavedChanges(false);
    setError(null);
  };

  // Check if a tab has data
  const tabHasData = (tabId) => {
    if (!currentBooklet || !currentBooklet.data.tabs[tabId]) return false;
    
    const tabData = currentBooklet.data.tabs[tabId];
    return Object.values(tabData).some(value => 
      value !== null && value !== undefined && value !== '' &&
      (typeof value !== 'object' || Object.keys(value).length > 0)
    );
  };

  // Get completion percentage
  const getCompletionPercentage = () => {
    if (!currentBooklet) return 0;
    
    const selectedTabs = currentBooklet.metadata.selectedTabs;
    if (selectedTabs.length === 0) return 0;
    
    const completedTabs = selectedTabs.filter(tabId => tabHasData(tabId));
    return Math.round((completedTabs.length / selectedTabs.length) * 100);
  };

  return (
    <BookletContext.Provider value={{
      currentBooklet,
      loading,
      error,
      hasUnsavedChanges,
      loadBooklet,
      createBooklet,
      updateBooklet,
      updateTabData,
      updateLocalTabData,
      saveAllChanges,
      clearBooklet,
      tabHasData,
      getCompletionPercentage
    }}>
      {children}
    </BookletContext.Provider>
  );
};

export const useBooklet = () => {
  const context = useContext(BookletContext);
  if (!context) {
    throw new Error('useBooklet must be used within a BookletProvider');
  }
  return context;
};

export default BookletContext;
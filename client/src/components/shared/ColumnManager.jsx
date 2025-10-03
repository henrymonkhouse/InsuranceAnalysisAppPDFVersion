import React, { useState, useEffect } from 'react';

const ColumnManager = ({ 
  initialColumns = [], 
  onColumnsChange, 
  maxAlternateColumns = 3,
  children 
}) => {
  // Base columns that always exist
  const BASE_COLUMNS = [
    { id: 'current', label: 'Current', type: 'base', isMarketing: false },
    { id: 'renewal', label: 'Renewal', type: 'base', isMarketing: false }
  ];

  const [columns, setColumns] = useState(() => {
    // Initialize with base columns and any existing alternates
    const alternates = initialColumns.filter(col => col.type === 'alternate') || [];
    return [...BASE_COLUMNS, ...alternates];
  });

  // Update parent when columns change
  useEffect(() => {
    onColumnsChange(columns);
  }, [columns, onColumnsChange]);

  const addAlternateColumn = () => {
    const alternateCount = columns.filter(col => col.type === 'alternate').length;
    if (alternateCount >= maxAlternateColumns) return;

    const newColumn = {
      id: `alternate${alternateCount + 1}`,
      label: `Alternate ${alternateCount + 1}`,
      type: 'alternate',
      isMarketing: false
    };

    setColumns(prev => [...prev, newColumn]);
  };

  const removeAlternateColumn = (columnId) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
  };

  const toggleMarketing = (columnId) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, isMarketing: !col.isMarketing }
        : col
    ));
  };

  const updateColumnLabel = (columnId, newLabel) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, label: newLabel }
        : col
    ));
  };

  const alternateColumns = columns.filter(col => col.type === 'alternate');
  const canAddMore = alternateColumns.length < maxAlternateColumns;

  return (
    <div className="column-manager">
      {/* Column Headers */}
      <div className="grid grid-cols-auto gap-4 mb-4">
        {columns.map((column) => (
          <div key={column.id} className="relative">
            {/* Marketing Checkbox (only for alternates) */}
            {column.type === 'alternate' && (
              <div className="flex items-center justify-center mb-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={column.isMarketing}
                    onChange={() => toggleMarketing(column.id)}
                    className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 font-medium">Marketing</span>
                </label>
              </div>
            )}

            {/* Column Header */}
            <div className={`
              p-3 text-center font-semibold rounded-t-lg border-b-2
              ${column.type === 'base' 
                ? 'bg-indigo-100 border-indigo-500 text-indigo-900' 
                : column.isMarketing
                  ? 'bg-green-100 border-green-500 text-green-900'
                  : 'bg-gray-100 border-gray-400 text-gray-700'
              }
            `}>
              {column.type === 'base' ? (
                <span>{column.label}</span>
              ) : (
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={column.label}
                    onChange={(e) => updateColumnLabel(column.id, e.target.value)}
                    className="bg-transparent border-none text-center font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                    placeholder="Column Name"
                  />
                  <button
                    onClick={() => removeAlternateColumn(column.id)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    title="Remove Column"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Column Button */}
        {canAddMore && (
          <div className="flex items-end">
            <button
              onClick={addAlternateColumn}
              className="p-3 bg-dashed border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 rounded-lg transition-colors flex items-center justify-center min-h-[52px]"
              title={`Add Alternate Column (${alternateColumns.length}/${maxAlternateColumns})`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Alt
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="column-content">
        {children({ columns, updateColumnLabel, toggleMarketing })}
      </div>
    </div>
  );
};

export default ColumnManager;
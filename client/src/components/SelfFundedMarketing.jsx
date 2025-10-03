import React, { useState, forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';

const SelfFundedMarketing = forwardRef(({ initialData = null, selfFundedData = null, onDataChange = () => {} }, ref) => {
  const [organizationName, setOrganizationName] = useState(
    initialData?.organizationName || selfFundedData?.organizationName || 'HARDROCK CONCRETE PLACEMENT'
  );
  const [effectiveDate, setEffectiveDate] = useState(
    initialData?.effectiveDate || selfFundedData?.effectiveDate || 'June 1, 2025'
  );

  // Section titles - editable
  const [tpaTitle, setTpaTitle] = useState(initialData?.tpaTitle || 'TPA (Third Party Administrator)');
  const [stopLossTitle, setStopLossTitle] = useState(initialData?.stopLossTitle || 'Stop Loss');
  const [pbmTitle, setPbmTitle] = useState(initialData?.pbmTitle || 'PBM (Pharmacy Benefit Manager)');
  const [captiveTitle, setCaptiveTitle] = useState(initialData?.captiveTitle || 'Captive Options');

  // Marketing comparison data - user can input costs manually or reference SF columns
  const [tpaRows, setTpaRows] = useState(
    initialData?.tpaRows || [
      { id: 1, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 2, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 3, name: '', status: '', cost: null, sfColumn: '', notes: '' }
    ]
  );

  const [stopLossRows, setStopLossRows] = useState(
    initialData?.stopLossRows || [
      { id: 1, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 2, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 3, name: '', status: '', cost: null, sfColumn: '', notes: '' }
    ]
  );

  const [pbmRows, setPbmRows] = useState(
    initialData?.pbmRows || [
      { id: 1, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 2, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 3, name: '', status: '', cost: null, sfColumn: '', notes: '' }
    ]
  );

  const [captiveRows, setCaptiveRows] = useState(
    initialData?.captiveRows || [
      { id: 1, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 2, name: '', status: '', cost: null, sfColumn: '', notes: '' },
      { id: 3, name: '', status: '', cost: null, sfColumn: '', notes: '' }
    ]
  );

  // Expose getData and getFormData methods for parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      organizationName,
      effectiveDate,
      tpaTitle,
      stopLossTitle,
      pbmTitle,
      captiveTitle,
      tpaRows,
      stopLossRows,
      pbmRows,
      captiveRows
    }),
    getFormData: () => ({
      organizationName,
      effectiveDate,
      tpaTitle,
      stopLossTitle,
      pbmTitle,
      captiveTitle,
      tpaRows,
      stopLossRows,
      pbmRows,
      captiveRows
    })
  }));

  // Update parent when data changes
  useEffect(() => {
    const data = {
      organizationName,
      effectiveDate,
      tpaTitle,
      stopLossTitle,
      pbmTitle,
      captiveTitle,
      tpaRows,
      stopLossRows,
      pbmRows,
      captiveRows
    };
    onDataChange(data);
  }, [organizationName, effectiveDate, tpaTitle, stopLossTitle, pbmTitle, captiveTitle, tpaRows, stopLossRows, pbmRows, captiveRows, onDataChange]);

  // Calculate metrics - use manual cost if provided, otherwise use SF column reference
  const metrics = useMemo(() => {
    const baseColumn = 'option1'; // Current/baseline column
    const baseCost = selfFundedData?.totals?.[baseColumn]?.annualMaxCost || 0;
    const basePremium = selfFundedData?.totals?.[baseColumn]?.totalAnnualPremium || 0;

    const result = {};

    // Calculate for TPA rows
    tpaRows.forEach(row => {
      let cost = null;

      // Use manual cost if provided, otherwise use SF column reference
      if (row.cost !== null && row.cost !== undefined && row.cost !== '') {
        cost = parseFloat(row.cost) || 0;
      } else if (row.sfColumn && selfFundedData?.totals?.[row.sfColumn]) {
        cost = selfFundedData.totals[row.sfColumn].annualMaxCost || 0;
      }

      if (cost !== null) {
        result[`tpa_${row.id}`] = {
          cost,
          percentDiff: baseCost ? ((cost / baseCost) - 1) * 100 : 0,
          dollarDiff: cost - baseCost
        };
      }
    });

    // Calculate for Stop Loss rows
    stopLossRows.forEach(row => {
      let cost = null;

      // Use manual cost if provided, otherwise use SF column reference
      if (row.cost !== null && row.cost !== undefined && row.cost !== '') {
        cost = parseFloat(row.cost) || 0;
      } else if (row.sfColumn && selfFundedData?.totals?.[row.sfColumn]) {
        cost = selfFundedData.totals[row.sfColumn].totalAnnualPremium || 0;
      }

      if (cost !== null) {
        result[`stopLoss_${row.id}`] = {
          cost,
          percentDiff: basePremium ? ((cost / basePremium) - 1) * 100 : 0,
          dollarDiff: cost - basePremium
        };
      }
    });

    // Calculate for Captive rows
    captiveRows.forEach(row => {
      const cost = row.cost !== null && row.cost !== undefined && row.cost !== ''
        ? parseFloat(row.cost) || 0
        : null;

      if (cost !== null) {
        result[`captive_${row.id}`] = {
          cost,
          percentDiff: baseCost ? ((cost / baseCost) - 1) * 100 : 0,
          dollarDiff: cost - baseCost
        };
      }
    });

    return result;
  }, [selfFundedData, tpaRows, stopLossRows, captiveRows]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatPercent = (value) => {
    if (!value && value !== 0) return '-';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const updateTpaRow = (id, field, value) => {
    setTpaRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const updateStopLossRow = (id, field, value) => {
    setStopLossRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const updatePbmRow = (id, field, value) => {
    setPbmRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const updateCaptiveRow = (id, field, value) => {
    setCaptiveRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  // Add row functions
  const addTpaRow = () => {
    const maxId = Math.max(...tpaRows.map(r => r.id), 0);
    setTpaRows(prev => [...prev, { id: maxId + 1, name: '', status: '', cost: null, sfColumn: '', notes: '' }]);
  };

  const addStopLossRow = () => {
    const maxId = Math.max(...stopLossRows.map(r => r.id), 0);
    setStopLossRows(prev => [...prev, { id: maxId + 1, name: '', status: '', cost: null, sfColumn: '', notes: '' }]);
  };

  const addPbmRow = () => {
    const maxId = Math.max(...pbmRows.map(r => r.id), 0);
    setPbmRows(prev => [...prev, { id: maxId + 1, name: '', status: '', cost: null, sfColumn: '', notes: '' }]);
  };

  const addCaptiveRow = () => {
    const maxId = Math.max(...captiveRows.map(r => r.id), 0);
    setCaptiveRows(prev => [...prev, { id: maxId + 1, name: '', status: '', cost: null, sfColumn: '', notes: '' }]);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      <div className="mx-auto w-full px-4 py-6 max-w-7xl">
        {/* Organization Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
              HR
            </div>
            <div>
              <input
                type="text"
                value={organizationName}
                onChange={e => setOrganizationName(e.target.value)}
                className="text-2xl font-bold text-indigo-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
              />
              <p className="text-sm text-gray-600">Medical Marketing Results</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Effective:</span>
            <input
              type="text"
              value={effectiveDate}
              onChange={e => setEffectiveDate(e.target.value)}
              className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
            />
          </div>
        </div>

        {/* TPA Section */}
        <div className="mb-8">
          <div className="bg-indigo-700 text-white p-3 font-bold text-lg mb-2 rounded-t-lg">
            <input
              type="text"
              value={tpaTitle}
              onChange={e => setTpaTitle(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white rounded px-2 w-full text-white placeholder-indigo-200"
              placeholder="Section Title"
            />
          </div>
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Line of Coverage</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Results</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Total Annual Maximum Costs</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">% Cost Difference</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">$ Cost Difference</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {tpaRows.map((row, idx) => {
                  const metric = metrics[`tpa_${row.id}`];
                  return (
                    <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.name}
                          onChange={e => updateTpaRow(row.id, 'name', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.status}
                          onChange={e => updateTpaRow(row.id, 'status', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="number"
                          value={row.cost || ''}
                          onChange={e => updateTpaRow(row.id, 'cost', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                          placeholder="Enter cost"
                        />
                      </td>
                      <td className={`px-4 py-3 border-t text-right font-medium ${
                        metric?.percentDiff > 0 ? 'text-red-600' : metric?.percentDiff < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {metric ? formatPercent(metric.percentDiff) : '-'}
                      </td>
                      <td className={`px-4 py-3 border-t text-right font-medium ${
                        metric?.dollarDiff > 0 ? 'text-red-600' : metric?.dollarDiff < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {metric ? `$${formatCurrency(Math.abs(metric.dollarDiff))}` : '-'}
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.notes}
                          onChange={e => updateTpaRow(row.id, 'notes', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-3 border-t bg-gray-50 flex justify-center">
              <button
                onClick={addTpaRow}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                + Add Row
              </button>
            </div>
          </div>
        </div>

        {/* Stop Loss Section */}
        <div className="mb-8">
          <div className="bg-sky-600 text-white p-3 font-bold text-lg mb-2 rounded-t-lg">
            <input
              type="text"
              value={stopLossTitle}
              onChange={e => setStopLossTitle(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white rounded px-2 w-full text-white placeholder-sky-200"
              placeholder="Section Title"
            />
          </div>
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Carrier</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Results</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Total Annual Premium</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">% Cost Difference</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">$ Cost Difference</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {stopLossRows.map((row, idx) => {
                  const metric = metrics[`stopLoss_${row.id}`];
                  return (
                    <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.name}
                          onChange={e => updateStopLossRow(row.id, 'name', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.status}
                          onChange={e => updateStopLossRow(row.id, 'status', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="number"
                          value={row.cost || ''}
                          onChange={e => updateStopLossRow(row.id, 'cost', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                          placeholder="Enter cost"
                        />
                      </td>
                      <td className={`px-4 py-3 border-t text-right font-medium ${
                        metric?.percentDiff > 0 ? 'text-red-600' : metric?.percentDiff < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {metric ? formatPercent(metric.percentDiff) : '-'}
                      </td>
                      <td className={`px-4 py-3 border-t text-right font-medium ${
                        metric?.dollarDiff > 0 ? 'text-red-600' : metric?.dollarDiff < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {metric ? `$${formatCurrency(Math.abs(metric.dollarDiff))}` : '-'}
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.notes}
                          onChange={e => updateStopLossRow(row.id, 'notes', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-3 border-t bg-gray-50 flex justify-center">
              <button
                onClick={addStopLossRow}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
              >
                + Add Row
              </button>
            </div>
          </div>
        </div>

        {/* PBM Section */}
        <div className="mb-8">
          <div className="bg-purple-600 text-white p-3 font-bold text-lg mb-2 rounded-t-lg">
            <input
              type="text"
              value={pbmTitle}
              onChange={e => setPbmTitle(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white rounded px-2 w-full text-white placeholder-purple-200"
              placeholder="Section Title"
            />
          </div>
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Provider</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Results</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {pbmRows.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 border-t">
                      <input
                        type="text"
                        value={row.name}
                        onChange={e => updatePbmRow(row.id, 'name', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 border-t">
                      <input
                        type="text"
                        value={row.status}
                        onChange={e => updatePbmRow(row.id, 'status', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 border-t">
                      <input
                        type="text"
                        value={row.notes}
                        onChange={e => updatePbmRow(row.id, 'notes', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 border-t bg-gray-50 flex justify-center">
              <button
                onClick={addPbmRow}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                + Add Row
              </button>
            </div>
          </div>
        </div>

        {/* Captive Section */}
        <div className="mb-8">
          <div className="bg-green-600 text-white p-3 font-bold text-lg mb-2 rounded-t-lg">
            <input
              type="text"
              value={captiveTitle}
              onChange={e => setCaptiveTitle(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-white rounded px-2 w-full text-white placeholder-green-200"
              placeholder="Section Title"
            />
          </div>
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Option</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Results</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Total Annual Cost</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">% Cost Difference</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">$ Cost Difference</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {captiveRows.map((row, idx) => {
                  const metric = metrics[`captive_${row.id}`];
                  return (
                    <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.name}
                          onChange={e => updateCaptiveRow(row.id, 'name', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.status}
                          onChange={e => updateCaptiveRow(row.id, 'status', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="number"
                          value={row.cost || ''}
                          onChange={e => updateCaptiveRow(row.id, 'cost', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                          placeholder="Enter cost"
                        />
                      </td>
                      <td className={`px-4 py-3 border-t text-right font-medium ${
                        metric?.percentDiff > 0 ? 'text-red-600' : metric?.percentDiff < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {metric ? formatPercent(metric.percentDiff) : '-'}
                      </td>
                      <td className={`px-4 py-3 border-t text-right font-medium ${
                        metric?.dollarDiff > 0 ? 'text-red-600' : metric?.dollarDiff < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {metric ? `$${formatCurrency(Math.abs(metric.dollarDiff))}` : '-'}
                      </td>
                      <td className="px-4 py-3 border-t">
                        <input
                          type="text"
                          value={row.notes}
                          onChange={e => updateCaptiveRow(row.id, 'notes', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-3 border-t bg-gray-50 flex justify-center">
              <button
                onClick={addCaptiveRow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                + Add Row
              </button>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold text-sm mb-2">Qualifications</h3>
          <p className="text-xs text-gray-600">* Lasers and final rates pending disclosure statement</p>
        </div>
      </div>
    </div>
  );
});

export default SelfFundedMarketing;

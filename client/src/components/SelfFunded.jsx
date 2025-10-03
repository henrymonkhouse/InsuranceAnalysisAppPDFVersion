import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react'

const TIERS = [
  { key: 'employee', label: 'Employee' },
  { key: 'employeeSpouse', label: 'Employee + Spouse' },
  { key: 'employeeChildren', label: 'Employee + Children' },
  { key: 'family', label: 'Family' }
]

const CLAIM_TIERS = [
  { key: 'employee', label: 'Employee Only' },
  { key: 'employeeSpouse', label: 'Employee/Spouse' },
  { key: 'employeeChildren', label: 'Employee/Child(ren)' },
  { key: 'family', label: 'Family' }
]

const formatCurrency = n => {
  const v = Number.isFinite(+n) ? +n : 0
  return v
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const SelfFunded = forwardRef(({ initialData = null, onDataChange = () => {} }, ref) => {
  const claimTiers = [
    { key: 'employee', label: 'Employee Only' },
    { key: 'employeeSpouse', label: 'Employee/Spouse' },
    { key: 'employeeChildren', label: 'Employee/Child(ren)' },
    { key: 'family', label: 'Family' }
  ]

  const [columns, setColumns] = useState(
    initialData?.columns || [
      { id: 'option1', label: 'Option 1', carrier: 'United Healthcare Ins Co', network: 'Choice Plus' },
      { id: 'option2', label: 'Option 2', carrier: 'United Healthcare Ins Co', network: 'Choice Plus' },
      { id: 'option3', label: 'Option 3', carrier: 'Tokio Marine HCC', network: 'Choice Plus' },
      { id: 'option4', label: 'Option 4', carrier: 'Tokio Marine HCC', network: 'Choice Plus' }
    ]
  )

  const [organizationName, setOrganizationName] = useState(
    initialData?.organizationName || 'HARDROCK CONCRETE PLACEMENT'
  )

  const [effectiveDate, setEffectiveDate] = useState(
    initialData?.effectiveDate || 'June 1, 2025'
  )

  const [counts, setCounts] = useState(
    initialData?.counts || {
      employee: 74,
      employeeSpouse: 8,
      employeeChildren: 10,
      family: 15
    }
  )

  const [compositeOverride, setCompositeOverride] = useState(
    initialData?.compositeOverride || null
  )

  const composite = useMemo(
    () =>
      compositeOverride !== null && compositeOverride !== '' ? 
        parseInt(compositeOverride, 10) || 0 :
        (counts.employee || 0) +
        (counts.employeeSpouse || 0) +
        (counts.employeeChildren || 0) +
        (counts.family || 0),
    [counts, compositeOverride]
  )

  const [specific, setSpecific] = useState(
    initialData?.specific || {
      limit: { option1: 50000, option2: 75000, option3: 50000, option4: 75000 },
      maxCoverage: { option1: 'Unlimited', option2: 'Unlimited', option3: 'Unlimited', option4: 'Unlimited' },
      contract: { option1: '12/15', option2: '12/15', option3: '12/15', option4: '12/15' },
      coverages: { option1: 'Med, Rx', option2: 'Med, Rx', option3: 'Med, Rx', option4: 'Med, Rx' },
      noNewLaser: { option1: 'No', option2: 'No', option3: 'No', option4: 'No' }
    }
  )

  const [aggregate, setAggregate] = useState(
    initialData?.aggregate || {
      annualMax: { option1: 1000000, option2: 1000000, option3: 1000000, option4: 1000000 },
      corridor: { option1: 120, option2: 120, option3: 120, option4: 120 },
      contract: { option1: '12/15', option2: '12/15', option3: '12/15', option4: '12/15' },
      coverages: { option1: 'Med, Rx', option2: 'Med, Rx', option3: 'Med, Rx', option4: 'Med, Rx' }
    }
  )

  const [premiums, setPremiums] = useState(
    initialData?.premiums || {
      employee: { option1: 202.23, option2: 163.29, option3: 195.82, option4: 151.59 },
      employeeSpouse: { option1: 350.0, option2: 449.06, option3: 451.47, option4: 365.72 },
      employeeChildren: { option1: 425.0, option2: 449.06, option3: 451.47, option4: 365.72 },
      family: { option1: 500.0, option2: 500.0, option3: 500.0, option4: 500.0 }
    }
  )

  const [aggregateRate, setAggregateRate] = useState(
    initialData?.aggregateRate || {
      option1: 21.69,
      option2: 24.02,
      option3: 13.94,
      option4: 15.07
    }
  )

  const [adminCosts, setAdminCosts] = useState(
    initialData?.adminCosts || {
      adminFee: 45.81,
      networkFee: 15.5,
      brokerFee: 35.0
    }
  )

  const [claimLiability, setClaimLiability] = useState(
    initialData?.claimLiability || {
      employee: { option1: 469.27, option2: 527.67, option3: 478.62, option4: 560.79 },
      employeeSpouse: { option1: 800.0, option2: 0, option3: 0, option4: 0 },
      employeeChildren: { option1: 700.0, option2: 0, option3: 0, option4: 0 },
      family: { option1: 1290.49, option2: 1454.09, option3: 1287.49, option4: 1462.44 }
    }
  )

  const expectedClaimFactor = 0.8

  // Expose getData method for parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      organizationName,
      effectiveDate,
      columns,
      counts,
      compositeOverride,
      specific,
      aggregate,
      premiums,
      aggregateRate,
      adminCosts,
      claimLiability,
      totals
    })
  }))

  // Update parent when data changes
  React.useEffect(() => {
    const data = {
      organizationName,
      effectiveDate,
      claimTiers,
      columns,
      counts,
      compositeOverride,
      specific,
      aggregate,
      premiums,
      aggregateRate,
      adminCosts,
      claimLiability
    }
    onDataChange(data)
  }, [organizationName, effectiveDate, claimTiers, columns, counts, compositeOverride, specific, aggregate, premiums, aggregateRate, adminCosts, claimLiability, onDataChange])

  const totals = useMemo(() => {
    const out = {}
    const aggMembers = composite
    const adminPerMember = (adminCosts.adminFee || 0) + (adminCosts.networkFee || 0) + (adminCosts.brokerFee || 0)

    columns.forEach(col => {
      const id = col.id

      const annualSpecificPremium =
        (premiums.employee[id] || 0) * (counts.employee || 0) * 12 +
        (premiums.employeeSpouse[id] || 0) * (counts.employeeSpouse || 0) * 12 +
        (premiums.employeeChildren[id] || 0) * (counts.employeeChildren || 0) * 12 +
        (premiums.family[id] || 0) * (counts.family || 0) * 12

      const annualAggregatePremium = (aggregateRate[id] || 0) * aggMembers * 12
      const totalAnnualPremium = annualSpecificPremium + annualAggregatePremium

      const annualAdminCosts = adminPerMember * aggMembers * 12
      const annualFixedCost = totalAnnualPremium + annualAdminCosts

      const annualMaxClaimLiability =
        (claimLiability.employee[id] || 0) * (counts.employee || 0) * 12 +
        (claimLiability.employeeSpouse[id] || 0) * (counts.employeeSpouse || 0) * 12 +
        (claimLiability.employeeChildren[id] || 0) * (counts.employeeChildren || 0) * 12 +
        (claimLiability.family[id] || 0) * (counts.family || 0) * 12

      const expectedClaimLiability = annualMaxClaimLiability * expectedClaimFactor
      const annualExpectedCost = annualFixedCost + expectedClaimLiability
      const annualMaxCost = annualFixedCost + annualMaxClaimLiability

      out[id] = {
        annualSpecificPremium,
        annualAggregatePremium,
        totalAnnualPremium,
        annualAdminCosts,
        annualFixedCost,
        annualMaxClaimLiability,
        expectedClaimLiability,
        annualExpectedCost,
        annualMaxCost
      }
    })

    const base = out.option1?.annualExpectedCost || 0
    columns.forEach(col => {
      const id = col.id
      const val = out[id]?.annualExpectedCost || 0
      out[id].expectedIncreasePercent = base ? ((val - base) / base) * 100 : 0
      out[id].expectedIncreaseDollar = val - base
    })

    return out
  }, [columns, counts, premiums, aggregateRate, adminCosts, claimLiability, expectedClaimFactor, composite])

  const gridCols = () => ({
    gridTemplateColumns: `320px repeat(${columns.length}, 1fr)`
  })

  const updateCount = (field, value) =>
    setCounts(prev => ({ ...prev, [field]: parseInt(value, 10) || 0 }))

  const updateColumn = (id, key, value) =>
    setColumns(prev => prev.map(c => (c.id === id ? { ...c, [key]: value } : c)))

  const updatePremium = (tier, colId, value) =>
    setPremiums(prev => ({ ...prev, [tier]: { ...prev[tier], [colId]: parseFloat(value) || 0 } }))

  const updateAggregateRate = (colId, value) =>
    setAggregateRate(prev => ({ ...prev, [colId]: parseFloat(value) || 0 }))

  const updateClaimLiability = (tier, colId, value) =>
    setClaimLiability(prev => ({ ...prev, [tier]: { ...prev[tier], [colId]: parseFloat(value) || 0 } }))

  const updateSpecific = (field, colId, value) =>
    setSpecific(prev => ({ ...prev, [field]: { ...prev[field], [colId]: value } }))

  const updateAggregate = (field, colId, value) =>
    setAggregate(prev => ({ ...prev, [field]: { ...prev[field], [colId]: value } }))

  const updateAdminCost = (field, value) =>
    setAdminCosts(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50">
      <div className="mx-auto w-full px-4 py-6 max-w-7xl">
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
              <p className="text-sm text-gray-600">Medical Renewal Analysis, Stop Loss Terms</p>
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

        <div className="grid gap-4 mb-2" style={gridCols()}>
          <div></div>
          {columns.map(col => (
            <div key={col.id} className="p-3 rounded-t-lg font-medium text-center bg-indigo-700 text-white">
              <input
                type="text"
                value={col.label}
                onChange={e => updateColumn(col.id, 'label', e.target.value)}
                className="w-full bg-transparent border-none text-center font-semibold focus:outline-none focus:ring-1 focus:ring-white rounded px-1 text-sm mb-1"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="bg-indigo-700 text-white p-2 font-medium">CARRIER</div>
          {columns.map(col => (
            <div key={col.id} className="bg-indigo-100 text-indigo-800 p-2 text-center">
              <input
                type="text"
                className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
                value={col.carrier}
                onChange={e => updateColumn(col.id, 'carrier', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-2" style={gridCols()}>
          <div className="bg-indigo-700 text-white p-2 font-medium">NETWORK</div>
          {columns.map(col => (
            <div key={col.id} className="bg-indigo-100 text-indigo-800 p-2 text-center">
              <input
                type="text"
                className="w-full bg-transparent border-0 text-indigo-800 text-center focus:ring-1 focus:ring-indigo-400"
                value={col.network}
                onChange={e => updateColumn(col.id, 'network', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-4" style={gridCols()}>
          <div className="bg-sky-600 text-white p-2 font-medium">SPECIFIC</div>
          {columns.map(col => <div key={`spacer-spec-${col.id}`}></div>)}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">Deductible</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                <input
                  type="number"
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  value={specific.limit[col.id] || ''}
                  onChange={e => updateSpecific('limit', col.id, parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Maximum Coverage Limit</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200 text-center">
              {specific.maxCoverage[col.id]}
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Contract</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200 text-center">
              <span className="text-green-600 mr-1">✓</span>
              {specific.contract[col.id]}
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Coverages</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200 text-center">
              {specific.coverages[col.id]}
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">No New Laser at Renewal</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200 text-center">
              {specific.noNewLaser[col.id]}
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-4" style={gridCols()}>
          <div className="bg-sky-600 text-white p-2 font-medium">AGGREGATE</div>
          {columns.map(col => <div key={`spacer-agg-${col.id}`}></div>)}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-t border-slate-200 font-medium">Annual Maximum</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                <input
                  type="number"
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  value={aggregate.annualMax[col.id] || ''}
                  onChange={e => updateAggregate('annualMax', col.id, parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Deductible Corridor</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="flex items-center justify-center space-x-1">
                <input
                  type="number"
                  className="w-20 text-center border border-slate-200 rounded py-1 focus:ring-2 focus:ring-indigo-500"
                  value={aggregate.corridor[col.id] || ''}
                  onChange={e => updateAggregate('corridor', col.id, parseFloat(e.target.value) || 0)}
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Contract</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="flex items-center justify-center">
                <span className="text-green-600 mr-1">✓</span>
                <input
                  type="text"
                  className="w-20 text-center border border-slate-200 rounded py-1 focus:ring-2 focus:ring-indigo-500"
                  value={aggregate.contract[col.id] || ''}
                  onChange={e => updateAggregate('contract', col.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Coverages</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <input
                type="text"
                className="w-full text-center border border-slate-200 rounded py-1 focus:ring-2 focus:ring-indigo-500"
                value={aggregate.coverages[col.id] || ''}
                onChange={e => updateAggregate('coverages', col.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Monthly Aggregate Accommodation</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200 text-center text-gray-600">
              Not Included
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">Terminal Liability Provision</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200 text-center text-gray-600">
              Not Included
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-4" style={gridCols()}>
          <div className="bg-green-600 text-white p-2 font-medium">STOP LOSS PREMIUM (Fixed)</div>
          {columns.map(col => <div key={`spacer-prem-${col.id}`}></div>)}
        </div>

        {TIERS.map(tier => (
          <div key={tier.key} className="grid gap-4" style={gridCols()}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
              <span>{tier.label}</span>
              <input
                type="number"
                className="w-12 text-center border border-slate-200 rounded px-1 text-indigo-700"
                value={counts[tier.key]}
                onChange={e => updateCount(tier.key, e.target.value)}
              />
            </div>
            {columns.map(col => (
              <div key={col.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={premiums[tier.key][col.id] || ''}
                    onChange={e => updatePremium(tier.key, col.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium">Annual Specific Premium</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-slate-100 border border-slate-200">
              <div className="text-center font-medium text-slate-900">
                ${formatCurrency(totals[col.id]?.annualSpecificPremium || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Aggregate</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Composite</span>
              <input
                type="number"
                value={compositeOverride !== null ? compositeOverride : composite}
                onChange={e => setCompositeOverride(e.target.value === '' ? null : e.target.value)}
                className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 text-indigo-700 text-sm bg-white mr-4"
                placeholder={composite}
              />
            </div>
          </div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                <input
                  type="number"
                  step="0.01"
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  value={aggregateRate[col.id] || ''}
                  onChange={e => updateAggregateRate(col.id, e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium">Annual Aggregate Premium</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-slate-100 border border-slate-200">
              <div className="text-center font-medium text-slate-900">
                ${formatCurrency(totals[col.id]?.annualAggregatePremium || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-indigo-100 border-l border-b border-slate-200 font-bold text-indigo-900">Total Annual Premium</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-indigo-100 border border-slate-200">
              <div className="text-center font-bold text-indigo-900">
                ${formatCurrency(totals[col.id]?.totalAnnualPremium || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-4" style={gridCols()}>
          <div className="bg-purple-600 text-white p-2 font-medium">ADMINISTRATIVE COSTS (Fixed)</div>
          {columns.map(col => <div key={`spacer-admin-${col.id}`}></div>)}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Administration Fee</span>
            <input
              type="number"
              value={adminCosts.adminFee || ''}
              onChange={e => updateAdminCost('adminFee', e.target.value)}
              className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 text-indigo-700 text-sm bg-white mr-4"
              placeholder="0"
            />
          </div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                <input
                  type="number"
                  step="0.01"
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  value={adminCosts.adminFee || ''}
                  onChange={e => updateAdminCost('adminFee', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Network Access Fee</span>
            <input
              type="number"
              value={adminCosts.networkFee || ''}
              onChange={e => updateAdminCost('networkFee', e.target.value)}
              className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 text-indigo-700 text-sm bg-white mr-4"
              placeholder="0"
            />
          </div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                <input
                  type="number"
                  step="0.01"
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  value={adminCosts.networkFee || ''}
                  onChange={e => updateAdminCost('networkFee', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
            <span>Broker Fee</span>
            <input
              type="number"
              value={adminCosts.brokerFee || ''}
              onChange={e => updateAdminCost('brokerFee', e.target.value)}
              className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 text-indigo-700 text-sm bg-white mr-4"
              placeholder="0"
            />
          </div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                <input
                  type="number"
                  step="0.01"
                  className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                  value={adminCosts.brokerFee || ''}
                  onChange={e => updateAdminCost('brokerFee', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium">Annual Administrative Costs</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-slate-100 border border-slate-200">
              <div className="text-center font-medium text-slate-900">
                ${formatCurrency(totals[col.id]?.annualAdminCosts || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-indigo-100 border-l border-b border-slate-200 font-bold text-indigo-900">Annual Fixed Cost</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-indigo-100 border border-slate-200">
              <div className="text-center font-bold text-indigo-900">
                ${formatCurrency(totals[col.id]?.annualFixedCost || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-4" style={gridCols()}>
          <div className="bg-red-600 text-white p-2 font-medium">AGGREGATE CLAIM LIABILITY</div>
          {columns.map(col => <div key={`spacer-claim-${col.id}`}></div>)}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-red-100 text-red-800 font-medium">Med. Rx</div>
          {columns.map(col => <div key={col.id} className="bg-red-50"></div>)}
        </div>

        {claimTiers.map(tier => (
          <div key={tier.key} className="grid gap-4" style={gridCols()}>
            <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium flex justify-between">
              <span>{tier.label}</span>
              <input
                type="number"
                value={counts[tier.key] || ''}
                onChange={e => updateCount(tier.key, e.target.value)}
                className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 text-indigo-700 text-sm bg-white mr-4"
                placeholder="0"
              />
            </div>
            {columns.map(col => (
              <div key={col.id} className="p-2 bg-white border border-slate-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">$</div>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full rounded-md border-0 py-2 pl-8 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                    value={claimLiability[tier.key][col.id] || ''}
                    onChange={e => updateClaimLiability(tier.key, col.id, e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-slate-100 border-l border-b border-slate-200 font-medium">Annual Maximum Claim Liability</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-slate-100 border border-slate-200">
              <div className="text-center font-medium text-slate-900">
                ${formatCurrency(totals[col.id]?.annualMaxClaimLiability || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-white border-l border-b border-slate-200 font-medium">
            Expected Claim Liability <span className="text-gray-600 text-sm">(80% of max)</span>
          </div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-white border border-slate-200">
              <div className="text-center text-slate-900">
                ${formatCurrency(totals[col.id]?.expectedClaimLiability || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 mt-6" style={gridCols()}>
          <div className="bg-indigo-700 text-white p-2 font-medium">FINANCIAL SUMMARY</div>
          {columns.map(col => <div key={`spacer-fin-${col.id}`}></div>)}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-green-100 border-l border-b border-slate-200 font-bold text-green-900">Annual Expected Plan Cost</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-green-100 border border-slate-200">
              <div className="text-center font-bold text-green-900">
                ${formatCurrency(totals[col.id]?.annualExpectedCost || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-red-100 border-l border-b border-slate-200 font-bold text-red-900">Annual Maximum Plan Cost</div>
          {columns.map(col => (
            <div key={col.id} className="p-2 bg-red-100 border border-slate-200">
              <div className="text-center font-bold text-red-900">
                ${formatCurrency(totals[col.id]?.annualMaxCost || 0)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-yellow-100 border-l border-b border-slate-200 font-medium text-yellow-900">Annual Percentage Savings/Increase</div>
          {columns.map(col => {
            const pct = totals[col.id]?.expectedIncreasePercent || 0
            const isBase = col.id === 'option1'
            const isIncrease = pct > 0
            return (
              <div key={col.id} className="p-2 bg-yellow-100 border border-slate-200">
                <div
                  className={`text-center font-bold ${
                    isBase ? 'text-gray-400' : isIncrease ? 'text-red-700' : 'text-green-700'
                  }`}
                >
                  {isBase ? '' : `${pct.toFixed(2)}%`}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid gap-4" style={gridCols()}>
          <div className="pl-4 p-2 bg-yellow-100 border-l border-b border-slate-200 font-medium text-yellow-900">Annual Dollar Savings/Increase</div>
          {columns.map(col => {
            const diff = totals[col.id]?.expectedIncreaseDollar || 0
            const isBase = col.id === 'option1'
            const isIncrease = diff > 0
            return (
              <div key={col.id} className="p-2 bg-yellow-100 border border-slate-200">
                <div
                  className={`text-center font-bold ${
                    isBase ? 'text-gray-400' : isIncrease ? 'text-red-700' : 'text-green-700'
                  }`}
                >
                  {isBase ? '' : `${formatCurrency(Math.abs(diff))}`}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold text-sm mb-2">Qualifications</h3>
          <p className="text-xs text-gray-600">Final Stop Loss rates pending disclosure statement</p>
          <p className="text-xs text-gray-600">
            Quoted limitations include no retiree coverage, Common Accident Provision, and Accelerated Reimbursement
          </p>
        </div>
      </div>
    </div>
  )
})

export default SelfFunded
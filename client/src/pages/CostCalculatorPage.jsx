import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  History,
  Scale
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const CostCalculatorPage = () => {
  const [cropName, setCropName] = useState('');
  const [landArea, setLandArea] = useState('');
  const [landUnit, setLandUnit] = useState('acres');

  // Input costs
  const [seedsCost, setSeedsCost] = useState('');
  const [landPrepCost, setLandPrepCost] = useState('');
  const [fertilizersCost, setFertilizersCost] = useState('');
  const [organicInputsCost, setOrganicInputsCost] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [machineryCost, setMachineryCost] = useState('');
  const [irrigationCost, setIrrigationCost] = useState('');
  const [pestCost, setPestCost] = useState('');
  const [transportCost, setTransportCost] = useState('');
  const [otherCost, setOtherCost] = useState('');

  // Revenue parameters
  const [expectedYieldQuantity, setExpectedYieldQuantity] = useState('');
  const [expectedPricePerUnit, setExpectedPricePerUnit] = useState('');

  const [calculation, setCalculation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const data = await api.get('/expenses/my-records');
      setHistory(data.records || []);
    } catch (err) {
      // Ignore background error
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post('/expenses/calculate', {
        cropName,
        landArea: Number(landArea),
        landUnit,
        seedsCost: Number(seedsCost),
        landPrepCost: Number(landPrepCost),
        fertilizersCost: Number(fertilizersCost),
        organicInputsCost: Number(organicInputsCost),
        labourCost: Number(labourCost),
        machineryCost: Number(machineryCost),
        irrigationCost: Number(irrigationCost),
        pestManagementCost: Number(pestCost),
        transportCost: Number(transportCost),
        otherCost: Number(otherCost),
        expectedYieldQuantity: Number(expectedYieldQuantity),
        expectedPricePerUnit: Number(expectedPricePerUnit),
        saveRecord: true
      });

      setCalculation(data.calculation);
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      await api.delete(`/expenses/records/${id}`);
      setHistory((prev) => prev.filter((r) => r._id !== id));
      if (calculation?.recordId === id) setCalculation(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
          <Calculator className="w-3.5 h-3.5" />
          <span>Farm Cultivation Economics</span>
          <VoiceReader text="Cultivation cost and profit calculator. Estimate real expenses, total yield revenue, break-even selling prices, and net income." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cultivation Cost & Net Profit Calculator
        </h1>
        <p className="text-sm text-slate-500">
          Know your real break-even cost per quintal before selling at the mandi to protect your margins.
        </p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Enter Cultivation Expenses</h2>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Land Area *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Unit
                </label>
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>

            {/* Input expense rows */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Itemized Operating Expenses (₹)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Seeds & Nursery</label>
                  <input
                    type="number"
                    value={seedsCost}
                    onChange={(e) => setSeedsCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Land Tillage / Tractor</label>
                  <input
                    type="number"
                    value={landPrepCost}
                    onChange={(e) => setLandPrepCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Chemical Fertilizers</label>
                  <input
                    type="number"
                    value={fertilizersCost}
                    onChange={(e) => setFertilizersCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Organic Manure (FYM)</label>
                  <input
                    type="number"
                    value={organicInputsCost}
                    onChange={(e) => setOrganicInputsCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Labour (Weeding/Transplant)</label>
                  <input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Irrigation / Electricity</label>
                  <input
                    type="number"
                    value={irrigationCost}
                    onChange={(e) => setIrrigationCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pest Management</label>
                  <input
                    type="number"
                    value={pestCost}
                    onChange={(e) => setPestCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Transport & Market Freight</label>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Expected Yield & Selling Price */}
            <div className="p-4 rounded-2xl bg-primary-50/60 border border-primary-200 space-y-3">
              <span className="text-xs font-bold text-primary-950 uppercase tracking-wider block">
                Harvest Yield & Selling Expectations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Expected Harvest (Quintals) *
                  </label>
                  <input
                    type="number"
                    required
                    value={expectedYieldQuantity}
                    onChange={(e) => setExpectedYieldQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Selling Price (₹ per Quintal) *
                  </label>
                  <input
                    type="number"
                    required
                    value={expectedPricePerUnit}
                    onChange={(e) => setExpectedPricePerUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md transition-all text-sm disabled:opacity-50"
            >
              <Calculator className="w-4 h-4" />
              <span>{loading ? 'Computing Financial Balance...' : 'Calculate Profit & Break-Even Price'}</span>
            </button>
          </form>
        </div>

        {/* Calculation Summary Card */}
        <div className="space-y-6">
          {calculation ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">{calculation.cropName} Financial Summary</h3>
                <VoiceReader
                  text={`Total cultivation cost is ${calculation.totalCost} rupees. Gross revenue is ${calculation.grossRevenue} rupees. Net profit is ${calculation.netProfitOrLoss} rupees. Break-even selling price is ${calculation.breakEvenPrice} rupees per quintal.`}
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Cultivation Cost</span>
                  <p className="text-2xl font-black text-slate-900">₹{calculation.totalCost.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-slate-400">₹{calculation.costPerUnitArea.toLocaleString('en-IN')} per {calculation.landUnit}</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Expected Gross Revenue</span>
                  <p className="text-2xl font-black text-blue-950">₹{calculation.grossRevenue.toLocaleString('en-IN')}</p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${calculation.isProfitable ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
                  <span className="text-[11px] font-bold uppercase tracking-wider block">
                    {calculation.isProfitable ? 'Estimated Net Profit' : 'Estimated Net Loss'}
                  </span>
                  <p className="text-3xl font-black">
                    ₹{Math.abs(calculation.netProfitOrLoss).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs font-semibold">
                    Profit Margin: {calculation.profitMarginPercent}%
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-900 block">Critical Break-Even Selling Price:</span>
                  <p className="text-base font-extrabold text-amber-950">₹{calculation.breakEvenPrice} / Quintal</p>
                  <p className="text-[11px] text-amber-800">
                    Never sell below ₹{calculation.breakEvenPrice}/qtl in the mandi; selling below this price causes an operational loss.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
                <LineChart className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Calculation Run Yet</h4>
              <p className="text-xs text-slate-500">Fill in your expenses and yield expectations to compute net returns.</p>
            </div>
          )}

          {history.length > 1 && (() => {
            const cropOptions = history.slice(0, 5);
            const best = cropOptions.reduce((highest, record) =>
              record.netProfitOrLoss > highest.netProfitOrLoss ? record : highest,
            cropOptions[0]);
            return (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-slate-400" />
                  <span>Crop Return Comparison</span>
                </h4>
                <p className="text-xs text-slate-500">Compare saved estimates using the same unit of measurement where possible.</p>
                <div className="space-y-2">
                  {cropOptions.map((record) => (
                    <div key={record._id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${record._id === best._id ? 'border-emerald-300 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{record.cropName}</p>
                        <p className="text-[10px] text-slate-500">{record.landArea} {record.landUnit} • Cost ₹{record.totalCost.toLocaleString('en-IN')}</p>
                      </div>
                      <span className={`text-xs font-black ${record.netProfitOrLoss >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        ₹{record.netProfitOrLoss.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-emerald-800">Highest estimated return: {best.cropName}</p>
              </div>
            );
          })()}

          {/* Past Calculation History */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-400" />
                <span>Saved Calculations</span>
              </h4>

              <div className="space-y-2.5">
                {history.slice(0, 4).map((h) => (
                  <div key={h._id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{h.cropName} ({h.landArea} {h.landUnit})</p>
                      <p className="text-[10px] text-slate-400">Profit: ₹{h.netProfitOrLoss.toLocaleString('en-IN')}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteHistory(h._id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


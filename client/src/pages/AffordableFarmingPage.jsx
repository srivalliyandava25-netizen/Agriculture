import React, { useState } from 'react';
import { Scale, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const AffordableFarmingPage = () => {
  const [horizon, setHorizon] = useState('3-year'); // '1-year', '3-year', '5-year'
  const [farmInputs, setFarmInputs] = useState({
    area: '', conventionalCost: '', sustainableCost: '', conventionalWater: '', sustainableWater: '',
    conventionalFertilizer: '', sustainableFertilizer: '', conventionalYield: '', sustainableYield: '', price: ''
  });
  const [customEstimate, setCustomEstimate] = useState(null);

  const updateFarmInput = (field) => (event) => {
    setFarmInputs((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const calculateCustomEstimate = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(Object.entries(farmInputs).map(([key, value]) => [key, Number(value)]));
    if (Object.values(values).some((value) => !Number.isFinite(value) || value < 0)) return;
    const area = values.area;
    if (!area) return;

    const conventionalRevenue = values.conventionalYield * values.price * area;
    const sustainableRevenue = values.sustainableYield * values.price * area;
    setCustomEstimate({
      conventionalCost: values.conventionalCost * area,
      sustainableCost: values.sustainableCost * area,
      conventionalWater: values.conventionalWater * area,
      sustainableWater: values.sustainableWater * area,
      conventionalFertilizer: values.conventionalFertilizer * area,
      sustainableFertilizer: values.sustainableFertilizer * area,
      conventionalProfit: conventionalRevenue - values.conventionalCost * area,
      sustainableProfit: sustainableRevenue - values.sustainableCost * area
    });
  };

  const comparisonData = {
    '1-year': {
      conventional: {
        inputCostPerAcre: '₹22,000',
        chemicalFertilizers: '350 kg (DAP + Urea + MOP)',
        waterRequirement: '100% (High)',
        labourHours: '80 hours',
        expectedYield: '22 quintals/acre',
        grossRevenue: '₹50,600',
        netProfit: '₹28,600',
        soilImpact: 'Degrades soil biology; builds chemical salts and binds micronutrients.'
      },
      sustainable: {
        inputCostPerAcre: '₹14,500',
        chemicalFertilizers: '100 kg (balanced with FYM + Vermicompost)',
        waterRequirement: '75% (Mulch reduces evaporation)',
        labourHours: '95 hours (Preparation of compost & biopesticides)',
        expectedYield: '19 quintals/acre (Initial transition lag)',
        grossRevenue: '₹47,500',
        netProfit: '₹33,000',
        soilImpact: 'Improves microbial count; begins rebuilding organic carbon.'
      }
    },
    '3-year': {
      conventional: {
        inputCostPerAcre: '₹26,000 (Pest resistance demands higher chemical doses)',
        chemicalFertilizers: '400 kg',
        waterRequirement: '100%',
        labourHours: '80 hours',
        expectedYield: '21 quintals/acre (Plateauing)',
        grossRevenue: '₹50,400',
        netProfit: '₹24,400',
        soilImpact: 'Severe compaction, soil crusting, and micro-nutrient deficiencies.'
      },
      sustainable: {
        inputCostPerAcre: '₹11,000 (Farm-produced inputs & green manure)',
        chemicalFertilizers: '0 - 50 kg (Biofertilizers dominant)',
        waterRequirement: '60% (High organic matter holds water)',
        labourHours: '80 hours (Streamlined farm practices)',
        expectedYield: '22 quintals/acre (Yield parity restored)',
        grossRevenue: '₹57,200 (Certified organic premium 10-15%)',
        netProfit: '₹46,200',
        soilImpact: 'Organic carbon exceeds 0.8%; earthworm activity returns.'
      }
    },
    '5-year': {
      conventional: {
        inputCostPerAcre: '₹30,000 (Escalating fertilizer and pesticide prices)',
        chemicalFertilizers: '450 kg',
        waterRequirement: '100%',
        labourHours: '80 hours',
        expectedYield: '20 quintals/acre',
        grossRevenue: '₹50,000',
        netProfit: '₹20,000',
        soilImpact: 'Loss of natural soil fertility; high dependency on synthetic inputs.'
      },
      sustainable: {
        inputCostPerAcre: '₹9,000 (Self-sustaining farm ecosystem)',
        chemicalFertilizers: 'Zero chemical dependence',
        waterRequirement: '50% (High moisture retention and mulching)',
        labourHours: '70 hours',
        expectedYield: '24 quintals/acre (Exceeds conventional with natural biology)',
        grossRevenue: '₹67,200 (20% organic market premium)',
        netProfit: '₹58,200',
        soilImpact: 'Rich, crumbly, fertile topsoil resilient against climate shocks.'
      }
    }
  };

  const current = comparisonData[horizon];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sand-100 text-earth-800 rounded-full text-xs font-bold">
          <Scale className="w-3.5 h-3.5" />
          <span>Transparent Agronomic Economics</span>
          <VoiceReader text="Affordable farming comparison. Compare conventional chemical farming with sustainable organic practices over 1, 3, and 5-year horizons." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Conventional vs. Sustainable Farming Comparison
        </h1>
        <p className="text-sm text-slate-500">
          Realistic side-by-side trade-offs. Understand transition timelines, input costs, and long-term net profits.
        </p>
      </div>

      <form onSubmit={calculateCustomEstimate} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Calculate for Your Farm</h2>
          <p className="text-xs text-slate-500 mt-1">Enter estimates per acre. Yields are quintals per acre and prices are rupees per quintal.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['area', 'Farm area (acres)'], ['price', 'Selling price / quintal'], ['conventionalCost', 'Conventional input cost / acre'],
            ['sustainableCost', 'Sustainable input cost / acre'], ['conventionalWater', 'Conventional water use / acre (litres)'],
            ['sustainableWater', 'Sustainable water use / acre (litres)'], ['conventionalFertilizer', 'Conventional fertilizer / acre (kg)'],
            ['sustainableFertilizer', 'Sustainable fertilizer / acre (kg)'], ['conventionalYield', 'Conventional yield / acre (quintals)'],
            ['sustainableYield', 'Sustainable yield / acre (quintals)']
          ].map(([field, label]) => (
            <label key={field} className="text-xs font-bold text-slate-700">
              {label}
              <input type="number" min="0" step="any" required value={farmInputs[field]} onChange={updateFarmInput(field)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-normal" />
            </label>
          ))}
        </div>
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-700 text-white text-xs font-bold hover:bg-primary-800">Compare farm estimates</button>
      </form>

      {customEstimate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ['Conventional', customEstimate.conventionalCost, customEstimate.conventionalWater, customEstimate.conventionalFertilizer, customEstimate.conventionalProfit],
            ['Sustainable', customEstimate.sustainableCost, customEstimate.sustainableWater, customEstimate.sustainableFertilizer, customEstimate.sustainableProfit]
          ].map(([name, cost, water, fertilizer, profit]) => (
            <div key={name} className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3">
              <h3 className="font-black text-slate-900">{name} estimate</h3>
              <p className="text-sm text-slate-600">Input cost: <strong>₹{Math.round(cost).toLocaleString('en-IN')}</strong></p>
              <p className="text-sm text-slate-600">Water use: <strong>{Math.round(water).toLocaleString('en-IN')} litres</strong></p>
              <p className="text-sm text-slate-600">Fertilizer: <strong>{Math.round(fertilizer).toLocaleString('en-IN')} kg</strong></p>
              <p className="text-sm text-slate-600">Estimated profit: <strong>₹{Math.round(profit).toLocaleString('en-IN')}</strong></p>
            </div>
          ))}
        </div>
      )}

      {/* Horizon Toggle */}
      <div className="flex justify-center">
        <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1">
          {['1-year', '3-year', '5-year'].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                horizon === h ? 'bg-primary-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h} Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Conventional Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Method A</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">Conventional Chemical Agriculture</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">High Input</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Input Expense / Acre:</span>
              <span className="font-extrabold text-rose-700">{current.conventional.inputCostPerAcre}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Synthetic Fertilizers:</span>
              <span className="font-bold text-slate-800">{current.conventional.chemicalFertilizers}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Water Requirement:</span>
              <span className="font-bold text-slate-800">{current.conventional.waterRequirement}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Expected Harvest Yield:</span>
              <span className="font-bold text-slate-800">{current.conventional.expectedYield}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Gross Market Revenue:</span>
              <span className="font-bold text-slate-800">{current.conventional.grossRevenue}</span>
            </div>
            <div className="flex justify-between py-2 text-sm bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-700 font-bold">Estimated Net Profit:</span>
              <span className="font-black text-slate-900">{current.conventional.netProfit}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-1">Soil & Ecology Health:</span>
            {current.conventional.soilImpact}
          </div>
        </div>

        {/* Sustainable Card */}
        <div className="bg-white border-2 border-primary-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-primary-700 uppercase tracking-wider block">Method B (Recommended)</span>
              <h2 className="text-xl font-black text-primary-950 mt-1">Integrated Sustainable Farming</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">High Margin</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Input Expense / Acre:</span>
              <span className="font-extrabold text-emerald-700">{current.sustainable.inputCostPerAcre}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Synthetic Fertilizers:</span>
              <span className="font-bold text-slate-800">{current.sustainable.chemicalFertilizers}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Water Requirement:</span>
              <span className="font-bold text-emerald-700">{current.sustainable.waterRequirement}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Expected Harvest Yield:</span>
              <span className="font-bold text-slate-800">{current.sustainable.expectedYield}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Gross Market Revenue:</span>
              <span className="font-bold text-emerald-900">{current.sustainable.grossRevenue}</span>
            </div>
            <div className="flex justify-between py-2 text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-emerald-950 font-bold">Estimated Net Profit:</span>
              <span className="font-black text-emerald-800">{current.sustainable.netProfit}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
            <span className="font-bold text-emerald-950 block mb-1">Soil & Ecology Health:</span>
            {current.sustainable.soilImpact}
          </div>
        </div>
      </div>
    </div>
  );
};


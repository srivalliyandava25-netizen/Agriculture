import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Truck,
  MapPin,
  Calendar,
  Info,
  DollarSign,
  ArrowRight,
  Filter
} from 'lucide-react';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

const INDIAN_STATES = [
  'All States',
  'Maharashtra',
  'Punjab',
  'Madhya Pradesh',
  'Gujarat',
  'Rajasthan',
  'Andhra Pradesh',
  'Haryana',
  'Uttar Pradesh'
];

export const MarketPricesPage = () => {
  const [selectedState, setSelectedState] = useState('All States');
  const [districtSearch, setDistrictSearch] = useState('');
  const [commoditySearch, setCommoditySearch] = useState('');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transport calculator states
  const [distanceKm, setDistanceKm] = useState('');
  const [produceQuantity, setProduceQuantity] = useState('');
  const [localPrice, setLocalPrice] = useState('');
  const [distantPrice, setDistantPrice] = useState('');
  const [transportResult, setTransportResult] = useState(null);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const stateParam = selectedState === 'All States' ? '' : selectedState;
      const data = await api.get(`/market/prices?state=${encodeURIComponent(stateParam)}&district=${encodeURIComponent(districtSearch)}&commodity=${encodeURIComponent(commoditySearch)}&limit=20`);
      setPrices(data.prices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedState]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPrices();
  };

  const handleTransportCalculate = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/market/transport-calculator', {
        distanceKm: Number(distanceKm),
        produceQuantityQuintals: Number(produceQuantity),
        localMandiPrice: Number(localPrice),
        distantMandiPrice: Number(distantPrice)
      });
      setTransportResult(data.economics);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>APMC Mandi Wholesale Station</span>
          <VoiceReader text="APMC mandi price intelligence station. Check live commodity rates and compare transport economics between local and distant markets." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Mandi Prices & Selling Guidance
        </h1>
        <p className="text-sm text-slate-500">
          Transparent wholesale auction rates across APMC mandis to help you sell at the peak price window.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
        Prices shown may be reference or sample data. Before selling, verify the latest rate with the relevant APMC, trader, or official Agmarknet portal.
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">State Filter</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">District / Nearby Market</label>
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder="e.g. Nashik"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Crop / Commodity</label>
            <div className="relative">
              <input
                type="text"
                value={commoditySearch}
                onChange={(e) => setCommoditySearch(e.target.value)}
                placeholder="Search Wheat, Onion, Tomato, Cotton, Soybean..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="w-full sm:w-auto pt-5">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors shadow-sm"
            >
              Filter Mandis
            </button>
          </div>
        </form>
      </div>

      {/* Mandi Rates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Current Wholesale Prices</h2>
          <span className="text-xs text-slate-400">Unit: ₹ per Standard Quintal (100 kg)</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-10 text-center">Loading mandi prices...</p>
        ) : prices.length === 0 ? (
          <p className="text-xs text-slate-500 py-10 text-center">No market prices found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prices.map((m) => (
              <div key={m._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {m.district}, {m.state}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-0.5">{m.commodity}</h3>
                    <p className="text-[11px] text-slate-500">{m.variety}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${m.trend === 'rising' ? 'bg-emerald-100 text-emerald-800' : m.trend === 'falling' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                    {m.trend} Trend
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modal Price</span>
                    <span className="text-2xl font-black text-slate-900">₹{m.modalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <p>Min: ₹{m.minPrice}</p>
                    <p>Max: ₹{m.maxPrice}</p>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                  <span>Mandi: {m.marketName}</span>
                  <span>{new Date(m.priceDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transport Economics Calculator Tool */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-primary-800 bg-primary-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Selling Strategy
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Mandi Transport Profitability Calculator</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare if hiring freight to travel to a distant bigger mandi yields a real net profit over selling locally.
          </p>
        </div>

        <form onSubmit={handleTransportCalculate} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Distance (km)</label>
            <input
              type="number"
              required
              min="0"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Produce Quantity (Quintals)</label>
            <input
              type="number"
              required
              min="0.1"
              value={produceQuantity}
              onChange={(e) => setProduceQuantity(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Local Mandi Price (₹/qtl)</label>
            <input
              type="number"
              required
              min="0"
              value={localPrice}
              onChange={(e) => setLocalPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Distant Mandi Price (₹/qtl)</label>
            <input
              type="number"
              required
              min="0"
              value={distantPrice}
              onChange={(e) => setDistantPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>Evaluate Transport Economics</span>
            </button>
          </div>
        </form>

        {transportResult && (
          <div className={`p-5 rounded-2xl border text-xs space-y-2 ${transportResult.isDistantMandiEconomical ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'}`}>
            <h4 className="font-bold text-sm">
              {transportResult.isDistantMandiEconomical ? 'Distant Mandi Recommended' : 'Local Mandi Recommended'}
            </h4>
            <p className="leading-relaxed">{transportResult.recommendation}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
              <div>Estimated Freight: <span className="font-bold">₹{transportResult.totalTransportCost}</span></div>
              <div>Freight / Quintal: <span className="font-bold">₹{transportResult.transportCostPerQuintal}</span></div>
              <div>Net Gain / Loss: <span className="font-bold">₹{transportResult.netExtraProfitOrLoss}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


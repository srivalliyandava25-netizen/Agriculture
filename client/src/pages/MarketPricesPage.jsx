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
import { INDIAN_STATES } from '../constants/indianStates.js';

const MARKET_STATES = ['All States', ...INDIAN_STATES];

export const MarketPricesPage = () => {
  const [selectedState, setSelectedState] = useState('All States');
  const [districtSearch, setDistrictSearch] = useState('');
  const [commoditySearch, setCommoditySearch] = useState('');
  const [marketSearch, setMarketSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketError, setMarketError] = useState('');

  // Transport calculator states
  const [distanceKm, setDistanceKm] = useState('');
  const [produceQuantity, setProduceQuantity] = useState('');
  const [localPrice, setLocalPrice] = useState('');
  const [distantPrice, setDistantPrice] = useState('');
  const [transportResult, setTransportResult] = useState(null);

  const fetchPrices = async (filters = {}) => {
    setLoading(true);
    setMarketError('');
    try {
      const state = filters.state ?? selectedState;
      const stateParam = state === 'All States' ? '' : state;
      const params = new URLSearchParams({
        state: stateParam,
        district: (filters.district ?? districtSearch).trim(),
        commodity: (filters.commodity ?? commoditySearch).trim(),
        marketName: (filters.marketName ?? marketSearch).trim(),
        limit: '100'
      });
      const from = filters.dateFrom ?? dateFrom;
      const to = filters.dateTo ?? dateTo;
      if (from) params.set('dateFrom', from);
      if (to) params.set('dateTo', to);
      const data = await api.get(`/market/prices?${params.toString()}`);
      setPrices(data.prices || []);
    } catch (err) {
      console.error(err);
      setPrices([]);
      setMarketError(err.message || 'Mandi prices could not be loaded. Please try again.');
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

  const handleClearFilters = () => {
    setSelectedState('All States');
    setDistrictSearch('');
    setCommoditySearch('');
    setMarketSearch('');
    setDateFrom('');
    setDateTo('');
    fetchPrices({ state: 'All States', district: '', commodity: '', marketName: '', dateFrom: '', dateTo: '' });
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

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:flex-wrap items-end gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">State Filter</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {MARKET_STATES.map((s) => (
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

          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">APMC / Market</label>
            <input
              type="text"
              value={marketSearch}
              onChange={(e) => setMarketSearch(e.target.value)}
              placeholder="e.g. Lasalgaon"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="w-full sm:w-40">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="w-full sm:w-40">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="w-full sm:w-auto flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors shadow-sm"
            >
              Filter Mandis
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50"
            >
              Clear
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
        ) : marketError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center">
            <p className="text-sm font-bold text-rose-800">Unable to load mandi prices</p>
            <p className="mt-1 text-xs text-rose-700">{marketError}</p>
          </div>
        ) : prices.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-bold text-slate-700">No mandi prices found</p>
            <p className="mt-1 text-xs text-slate-500">Try clearing the filters, choosing another state, or checking the market again later.</p>
          </div>
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
                  <span>{m.isSampleData ? 'Reference' : (m.dataSource || 'Mandi record')} · {new Date(m.priceDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price History */}
      {prices.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Mandi Price History</h2>
              <p className="text-xs text-slate-500 mt-1">Reported rates matching the selected filters, newest first.</p>
            </div>
            <Calendar className="w-5 h-5 text-primary-700" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Commodity</th>
                  <th className="py-3 pr-4">Market</th>
                  <th className="py-3 pr-4">District / State</th>
                  <th className="py-3 pr-4">Min</th>
                  <th className="py-3 pr-4">Modal</th>
                  <th className="py-3">Max</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((m) => (
                  <tr key={`history-${m._id}`} className="border-b border-slate-100 last:border-0 text-slate-700">
                    <td className="py-3 pr-4 whitespace-nowrap">{m.priceDate ? new Date(m.priceDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                    <td className="py-3 pr-4 font-bold text-slate-900">{m.commodity}</td>
                    <td className="py-3 pr-4">{m.marketName}</td>
                    <td className="py-3 pr-4">{m.district}, {m.state}</td>
                    <td className="py-3 pr-4">₹{Number(m.minPrice).toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4 font-bold text-primary-800">₹{Number(m.modalPrice).toLocaleString('en-IN')}</td>
                    <td className="py-3">₹{Number(m.maxPrice).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


    </div>
  );
};


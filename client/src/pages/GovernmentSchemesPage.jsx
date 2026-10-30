import React, { useState, useEffect } from 'react';
import { Award, Search, ExternalLink, CheckCircle2, FileText, CalendarClock, MapPin } from 'lucide-react';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const GovernmentSchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ category, search });
      if (state.trim()) params.set('state', state.trim());
      const data = await api.get(`/schemes?${params.toString()}`);
      setSchemes(data.schemes || []);
    } catch (err) {
      console.error(err);
      setSchemes([]);
      setError('Scheme information could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>Verified Government Portal Directory</span>
          <VoiceReader text="Government schemes directory. Verified information on PM-KISAN, PMFBY crop insurance, PKVY organic subsidies, and Kisan Credit Cards." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Government Schemes & Agricultural Subsidies
        </h1>
        <p className="text-sm text-slate-500">
          Official eligibility criteria, document checklists, and application links for Central and State assistance.
        </p>
      </div>

      {/* Category Filter & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'financial_support', 'crop_insurance', 'soil_health', 'organic_farming', 'irrigation_water', 'credit_loan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                category === cat
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes by name, keyword, or benefit..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative sm:w-52">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State (optional)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Schemes List */}
      {error ? (
        <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl py-4 text-center">{error}</p>
      ) : loading ? (
        <p className="text-xs text-slate-500 py-12 text-center">Loading verified schemes...</p>
      ) : schemes.length === 0 ? (
        <p className="text-xs text-slate-500 py-12 text-center">No schemes found matching criteria.</p>
      ) : (
        <div className="space-y-6">
          {schemes.map((s) => (
            <div key={s._id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800">
                      {s.level} Scheme &bull; {s.code}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Verified: {new Date(s.verifiedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{s.schemeName}</h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">{s.purpose}</p>
                </div>

                <a
                  href={s.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-700 text-white hover:bg-primary-800 transition-colors shadow-sm flex-shrink-0"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Benefits & Eligibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-1.5">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Key Farmer Benefits</span>
                  </h4>
                  <ul className="space-y-1 text-emerald-900">
                    {(s.benefits || []).map((b, i) => (
                      <li key={i}>&bull; {b}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>Eligibility Criteria</span>
                  </h4>
                  <ul className="space-y-1 text-slate-700">
                    {(s.eligibilityCriteria || []).map((crit, i) => (
                      <li key={i}>&bull; {crit}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Documents & Helpline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Required Documents:</span>
                  <p className="text-[11px]">{(s.requiredDocuments || []).join(', ') || 'Confirm required documents at the official portal.'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 flex items-center gap-1 mb-1"><CalendarClock className="w-3.5 h-3.5" /> Application deadline</span>
                  <p className="text-[11px]">
                    {s.applicationDeadline
                      ? new Date(s.applicationDeadline).toLocaleDateString()
                      : s.deadlineNote || 'Open-ended or season/state-dependent. Check the official portal before applying.'}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Official Helpline:</span>
                  <p className="text-[11px] text-primary-800 font-bold">{s.helpline || 'See the official portal'}</p>
                </div>
              </div>

              {(s.applicationProcedure || []).length > 0 && (
                <details className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
                  <summary className="cursor-pointer font-bold text-slate-800">How to apply</summary>
                  <ol className="mt-2 list-decimal list-inside space-y-1 text-slate-600">
                    {(s.applicationProcedure || []).map((step, index) => <li key={index}>{step}</li>)}
                  </ol>
                  <p className="mt-3 text-[10px] text-slate-500">Always verify eligibility, dates, documents, and the final application steps on the linked official portal before submitting personal information or fees.</p>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


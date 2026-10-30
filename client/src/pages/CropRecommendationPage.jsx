import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sprout,
  CheckCircle2,
  Calendar,
  Droplets,
  DollarSign,
  TrendingUp,
  RotateCw,
  Sparkles,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';
import { INDIAN_STATES } from '../constants/indianStates.js';

export const CropRecommendationPage = () => {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [season, setSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [irrigationType, setIrrigationType] = useState('');
  const [previousCrop, setPreviousCrop] = useState('');
  const [ph, setPh] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [climate, setClimate] = useState('');
  const [farmSize, setFarmSize] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRecommend = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSavedSuccess(false);

    try {
      const data = await api.post('/crops/recommend', {
        state,
        district,
        season,
        soilType,
        irrigationType,
        previousCrop,
        ph: ph ? Number(ph) : null,
        nitrogen: nitrogen ? Number(nitrogen) : null,
        phosphorus: phosphorus ? Number(phosphorus) : null,
        potassium: potassium ? Number(potassium) : null,
        climate,
        farmSize: Number(farmSize) || 2,
        saveResult: true
      });

      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to generate crop recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>ICAR-Guided Agro-Climatic Engine</span>
          <VoiceReader text="Crop recommendation engine. Find the most suitable crops for your state, season, soil type, and crop rotation." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI-Assisted Crop Recommendation
        </h1>
        <p className="text-sm text-slate-500">
          Ranked recommendations based on soil health parameters, seasonal rainfall patterns, and pest-disrupting crop rotation rules.
        </p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Input Parameters Wizard */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleRecommend} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                District
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Pune, Ludhiana"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="Rabi (Winter)">Rabi (Winter: Oct - March)</option>
                <option value="Kharif (Monsoon)">Kharif (Monsoon: June - Oct)</option>
                <option value="Zaid (Summer)">Zaid (Summer: March - June)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="Alluvial">Alluvial (जलोढ़)</option>
                <option value="Black">Black Soil (काली मिट्टी)</option>
                <option value="Red & Yellow">Red & Yellow (लाल मिट्टी)</option>
                <option value="Clay Loam">Clay Loam (दोमट)</option>
                <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                <option value="Arid / Desert">Arid / Sandy (रेतीली)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Irrigation System
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="drip">Drip Irrigation (टपक सिंचाई)</option>
                <option value="sprinkler">Sprinkler Irrigation (फव्वारा)</option>
                <option value="flood">Canal / Tube-well Flood</option>
                <option value="rainfed">Rainfed / Dryland Farming</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Previous Harvested Crop
              </label>
              <input
                type="text"
                value={previousCrop}
                onChange={(e) => setPreviousCrop(e.target.value)}
                placeholder="e.g. Paddy, Wheat, Cotton"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Soil pH (Optional)</label>
              <input type="number" step="0.1" min="0" max="14" value={ph} onChange={(e) => setPh(e.target.value)} placeholder="e.g. 7.1" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nitrogen kg/ha</label>
              <input type="number" min="0" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} placeholder="From soil test" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phosphorus kg/ha</label>
              <input type="number" min="0" value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} placeholder="From soil test" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Potassium kg/ha</label>
              <input type="number" min="0" value={potassium} onChange={(e) => setPotassium(e.target.value)} placeholder="From soil test" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Climate</label>
              <select value={climate} onChange={(e) => setClimate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                <option>Hot / Tropical</option>
                <option>Semi-arid</option>
                <option>Arid / Dry</option>
                <option>Humid / Subtropical</option>
                <option>Temperate / Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Farm Size (Acres)
              </label>
              <input
                type="number"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                placeholder="2"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md shadow-primary-700/20 transition-all text-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Evaluating Suitability Matrix...' : 'Find Highly Suitable Crops'}</span>
          </button>
        </form>
      </div>

      {/* Recommendation Results */}
      {results && (
        <div className="space-y-8 animate-fadeIn">
          {/* Crop Rotation Advisory Box */}
          {results.cropRotationAdvice && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
              <RotateCw className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block mb-1">Scientific Crop Rotation Guidance:</span>
                <p className="leading-relaxed">{results.cropRotationAdvice}</p>
              </div>
            </div>
          )}

          {/* Top Recommended Crops Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Top Recommended Crops for Your Farm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.recommendations.map((crop, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Rank #{idx + 1} • {crop.scientificName}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{crop.cropName}</h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-primary-800 bg-primary-100 px-3 py-1 rounded-full border border-primary-200 block">
                          {crop.suitabilityScore}% Match
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 mt-0.5 block">{crop.suitabilityCategory}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                      <p><span className="font-bold text-slate-800">Planting Window: </span>{crop.plantingWindow}</p>
                      <p><span className="font-bold text-slate-800">Duration: </span>{crop.cropDurationDays}</p>
                      <p><span className="font-bold text-slate-800">Water Requirement: </span>{crop.waterRequirementMm}</p>
                      <p><span className="font-bold text-slate-800">Expected Yield: </span>{crop.expectedYieldRange}</p>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-800 block">Why this crop matches:</span>
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        {crop.matchReasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1">
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-earth-700" />
                        <span>Market Outlook:</span>
                      </p>
                      <p className="text-slate-600 text-[11px]">{crop.marketPriceOutlook}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Investment</span>
                      <span className="text-sm font-black text-slate-900">₹{crop.estimatedCostPerAcre?.toLocaleString('en-IN')}/acre</span>
                    </div>
                    <Link
                      to="/fertilizer-advisory"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors"
                    >
                      <span>Calculate Fertilizer &rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Crops */}
          {results.alternativeCrops?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Alternative Crops with Trade-offs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.alternativeCrops.map((alt, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5 text-xs">
                    <h4 className="font-extrabold text-sm text-slate-800">{alt.cropName}</h4>
                    <p className="text-slate-600">{alt.reason}</p>
                    {alt.plantingWindow && <p className="font-semibold text-primary-800">Ideal sowing window: {alt.plantingWindow}</p>}
                    <p className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">{alt.tradeOffs}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


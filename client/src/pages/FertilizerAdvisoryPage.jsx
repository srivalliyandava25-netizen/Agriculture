import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Sprout,
  ShieldAlert,
  Printer,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const FertilizerAdvisoryPage = () => {
  const [cropName, setCropName] = useState('');
  const [customCropName, setCustomCropName] = useState('');
  const [landArea, setLandArea] = useState('');
  const [landUnit, setLandUnit] = useState('acres');
  const [soilReports, setSoilReports] = useState([]);
  const [selectedSoilReportId, setSelectedSoilReportId] = useState('');

  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load farmer's existing soil reports to link
    const loadReports = async () => {
      try {
        const data = await api.get('/soil/reports');
        if (data.reports && data.reports.length > 0) {
          setSoilReports(data.reports);
        }
      } catch (err) {
        // Continue without preselected soil report
      }
    };
    loadReports();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const selectedCropName = cropName === '__custom__' ? customCropName.trim() : cropName.trim();
    if (!selectedCropName) {
      setError('Please select a crop or enter a custom crop name.');
      setLoading(false);
      return;
    }

    try {
      const data = await api.post('/fertilizers/advisory', {
        cropName: selectedCropName,
        landArea: Number(landArea) || 1,
        landUnit,
        soilReportId: selectedSoilReportId || null
      });

      setAdvisory(data.advisory);
    } catch (err) {
      setError(err.message || 'Failed to generate fertilizer advisory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold mb-2">
            <Droplets className="w-3.5 h-3.5" />
            <span>4R Nutrient Stewardship & INM Engine</span>
            <VoiceReader text="Fertilizer and nutrient advisory. Calculate exact chemical doses and organic amendments tailored to your crop and land area." />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Fertilizer & Nutrient Advisory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Combines verified state package of practices with your Soil Health Card to avoid costly fertilizer over-application.
          </p>
        </div>

        {advisory && (
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors no-print"
          >
            <Printer className="w-4 h-4" />
            <span>Print Advisory</span>
          </button>
        )}
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important:</strong> Advisories without a recent laboratory soil-test report are only general guidance, not a precise fertilizer prescription. Get the soil tested through an accredited laboratory before applying quantities.
          </p>
        </div>
      </div>

      {/* Input Parameters Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm no-print">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Crop Name *
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-medium"
              >
                <option value="" disabled>Select a crop</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Paddy">Paddy / Rice (धान)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Chickpea">Chickpea / Gram (चना)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Groundnut">Groundnut (मूंगफली)</option>
                <option value="Sugarcane">Sugarcane (गन्ना)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="__custom__">Other / Enter custom crop</option>
              </select>
              {cropName === '__custom__' && (
                <input
                  type="text"
                  required
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  placeholder="Enter crop name, e.g. Onion"
                  className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Land Cultivation Area *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="Enter cultivation area"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-bold"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Link Soil Test Card (Optional)
              </label>
              <select
                value={selectedSoilReportId}
                onChange={(e) => setSelectedSoilReportId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">No report linked (Standard package)</option>
                {soilReports.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.farmLocation} ({r.knownSoilType} Soil)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md transition-all text-sm disabled:opacity-50 mt-2"
          >
            <Droplets className="w-4 h-4" />
            <span>{loading ? 'Calculating Nutrient Dosages...' : 'Calculate Exact Fertilizer Doses'}</span>
          </button>
        </form>
      </div>

      {/* Generated Advisory Output */}
      {advisory && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-primary-800 bg-primary-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Integrated Nutrient Management Plan
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Fertilizer Schedule for {advisory.cropName} ({advisory.landArea} {advisory.landUnit})
              </h2>
            </div>
            <VoiceReader
              text={`Fertilizer schedule for ${advisory.cropName}. Nitrogen, Phosphorus, and Potassium requirements calculated. Review chemical and organic options below.`}
            />
          </div>

          {/* Integrated Plan Banner */}
          <div className="p-4 rounded-2xl bg-primary-50 border border-primary-200 text-xs text-primary-950 space-y-1">
            <span className="font-bold text-sm block flex items-center gap-1.5 text-primary-900">
              <Sprout className="w-4 h-4" />
              <span>Recommended Integrated Approach (4R Stewardship)</span>
            </span>
            <p className="leading-relaxed">{advisory.integratedNutrientManagementPlan}</p>
          </div>

          {/* Deficiencies Identified */}
          {advisory.nutrientDeficiencies?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Soil Nutrient Observations</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                {advisory.nutrientDeficiencies.map((def, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span className="text-primary-700 font-bold">•</span>
                    <span>{def}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Chemical Fertilizer Schedule */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-700" />
              <span>Chemical Fertilizer Dosages & Split Timing</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advisory.chemicalOptions.map((opt, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{opt.fertilizerName}</h4>
                    <span className="text-xl font-black text-primary-800 block mt-1">{opt.quantityPerAcre}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-200 pt-2">
                    <p><span className="font-bold text-slate-800">Basal Dose: </span>{opt.basalDose}</p>
                    <p><span className="font-bold text-slate-800">Split Doses: </span>{opt.splitDoses}</p>
                    <p className="text-[11px] text-amber-800 font-medium pt-1">
                      <span className="font-bold">Precaution: </span>{opt.precautions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organic Options */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-700" />
              <span>Organic Soil Amendments (Essential for Long-Term Fertility)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisory.organicOptions.map((org, i) => (
                <div key={i} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-emerald-950">{org.name}</h4>
                    <span className="font-extrabold text-emerald-800">{org.quantityPerAcre}</span>
                  </div>
                  <p className="text-emerald-900"><span className="font-bold">Timing: </span>{org.timing}</p>
                  <p className="text-emerald-800 text-[11px]"><span className="font-bold">Benefits: </span>{org.benefits}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Over-Application Warnings */}
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2 text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
              <span>Hazards of Excessive Chemical Application</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-rose-900 leading-relaxed">
              {advisory.overApplicationWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};


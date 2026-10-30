import React, { useState, useEffect } from 'react';
import {
  Bug,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  History,
  Trash2,
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const DiseaseDetectionPage = () => {
  const [cropName, setCropName] = useState('');
  const [customCropName, setCustomCropName] = useState('');
  const [symptomsDescription, setSymptomsDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const data = await api.get('/disease/history?limit=6');
      setHistory(data.records || []);
    } catch (err) {
      // Ignore background fetch error
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP leaf image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be under 5MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedCropName = cropName === '__custom__' ? customCropName.trim() : cropName.trim();
    if (!selectedCropName) {
      setError('Please select a crop or enter a custom crop name.');
      return;
    }
    if (!selectedFile) {
      setError('Please select or capture a leaf photograph.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('cropName', selectedCropName);
      if (symptomsDescription) {
        formData.append('symptomsDescription', symptomsDescription);
      }

      const res = await api.post('/disease/detect', formData);
      setAnalysis(res.analysis);
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Disease detection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      await api.delete(`/disease/history/${id}`);
      setHistory((prev) => prev.filter((h) => h._id !== id));
      if (analysis?._id === id) setAnalysis(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
          <Bug className="w-3.5 h-3.5" />
          <span>Computer Vision Diagnostic Tool</span>
          <VoiceReader text="Crop disease detection tool. Upload a picture of an affected plant leaf or fruit to identify symptoms and treatments." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Plant Doctor & Crop Disease Detection
        </h1>
        <p className="text-sm text-slate-500">
          Upload leaf pictures for symptom screening, bio-control recipes, and verified safe chemical management.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950 leading-relaxed">
        <strong>Important:</strong> Results are preliminary possible diagnoses based on the selected crop and symptom description, not a laboratory diagnosis. Verify serious or spreading problems with a local plant clinic or agricultural expert before treatment.
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Upload Plant Photo</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Crop *
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="" disabled>Select crop</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Rice">Paddy / Rice (धान)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Chili">Chili (मिर्च)</option>
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
                Observed Symptoms (Optional)
              </label>
              <input
                type="text"
                value={symptomsDescription}
                onChange={(e) => setSymptomsDescription(e.target.value)}
                placeholder="e.g. Yellow leaf curls, brown concentric spots"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-primary-500 rounded-2xl p-5 text-center transition-colors">
              <input
                type="file"
                id="leafImage"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="leafImage" className="cursor-pointer space-y-2 block">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">Choose Leaf Photo</span>
                <span className="text-[10px] text-slate-400 block">Clear close-up &bull; JPEG/PNG/WebP</span>
              </label>
            </div>

            {previewUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img src={previewUrl} alt="Leaf Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md transition-all text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Screening Plant Pathogen...' : 'Diagnose Plant Leaf'}</span>
            </button>
          </form>
        </div>

        {/* Diagnosis Results Display */}
        <div className="lg:col-span-2 space-y-6">
          {analysis ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-800 bg-primary-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {analysis.cropName} Diagnosis
                    </span>
                    {analysis.isInconclusive ? (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                        Inconclusive Result
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        {analysis.confidence}% Confidence
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">{analysis.diseaseIdentified}</h2>
                  {analysis.scientificName && analysis.scientificName !== 'N/A' && (
                    <p className="text-xs text-slate-500 italic mt-0.5">Pathogen: {analysis.scientificName}</p>
                  )}
                </div>

                <VoiceReader
                  text={`Identified disease: ${analysis.diseaseIdentified}. Confidence: ${analysis.confidence} percent. Symptoms: ${analysis.symptoms.join('. ')}. Recommended organic remedy: ${analysis.organicCures[0]}`}
                />
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Visible Symptoms</h3>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {analysis.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary-700 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.causes?.length > 0 && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs">
                  <span className="font-bold text-blue-950 block mb-1.5">Possible causes</span>
                  <ul className="list-disc list-inside space-y-1 text-blue-900">
                    {analysis.causes.map((cause, idx) => <li key={idx}>{cause}</li>)}
                  </ul>
                </div>
              )}

              {/* Organic Biocontrols vs Chemical Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                  <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Safe Organic & Bio Cures</span>
                  </h4>
                  <ul className="space-y-1.5 text-emerald-900">
                    {analysis.organicCures.map((cure, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <span>{cure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Chemical Controls (Label Regulated)</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {analysis.chemicalControls.map((chem, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{chem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Preventive Measures */}
              <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-800 block">Preventive Field Hygiene:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {analysis.preventiveMeasures.map((prev, idx) => (
                    <li key={idx}>{prev}</li>
                  ))}
                </ul>
              </div>

              {/* Safety Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-200">
                <strong>Safety Disclaimer:</strong> {analysis.safetyDisclaimer}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Bug className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Leaf Scanned Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your crop, snap a close-up photo of the affected leaf, and click "Diagnose Plant Leaf" to screen for diseases.
              </p>
            </div>
          )}

          {/* Past Disease Analyses History */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <span>Recent Diagnosis History</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {history.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setAnalysis(item)}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-primary-50/50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{item.diseaseIdentified}</h4>
                      <p className="text-[10px] text-slate-400">
                        {item.cropName} &bull; {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistory(item._id);
                      }}
                      className="p-1 text-slate-300 hover:text-red-500"
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


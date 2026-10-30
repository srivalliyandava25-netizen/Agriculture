import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Upload,
  Calendar,
  AlertTriangle,
  FileCheck,
  Trash2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const InsuranceAssistancePage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [cropName, setCropName] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [affectedAreaAcres, setAffectedAreaAcres] = useState('');
  const [estimatedLossPercent, setEstimatedLossPercent] = useState('');
  const [cropStageAtDamage, setCropStageAtDamage] = useState('');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.get('/insurance/my-incidents');
      setIncidents(data.incidents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('cropName', cropName);
      formData.append('incidentType', incidentType);
      formData.append('incidentDate', incidentDate);
      formData.append('affectedAreaAcres', affectedAreaAcres);
      formData.append('estimatedLossPercent', estimatedLossPercent);
      formData.append('cropStageAtDamage', cropStageAtDamage);
      formData.append('notes', notes);
      if (photoFile) formData.append('photo', photoFile);

      const res = await api.post('/insurance/report-damage', formData);
      setShowModal(false);
      setMessage(res.message);
      fetchIncidents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this private damage record?')) return;
    try {
      await api.delete(`/insurance/incidents/${id}`);
      setIncidents((prev) => prev.filter((i) => i._id !== id));
      setMessage('Damage record removed.');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Disaster Relief & Insurance Logger</span>
            <VoiceReader text="Crop insurance and disaster assistance. Log private damage records and track document checklists for PMFBY claims." />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Crop Insurance & Damage Incident Logging
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain private, timestamped photographic evidence of crop damage to ensure swift PMFBY insurance surveyor clearance.
          </p>
        </div>

        <button
          onClick={() => setShowModal(!showModal)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Log Damage Incident</span>
        </button>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

      {/* Critical 72-Hour Warning */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-sm block mb-0.5">PMFBY 72-Hour Claim Rule:</span>
          Under Pradhan Mantri Fasal Bima Yojana rules, localized natural calamities (hailstorm, inundation, landslide, cloudburst) <strong>must be reported to your insurance bank, CSC, or the toll-free helpline (1800-180-1551) within 72 hours</strong> of the incident.
        </div>
      </div>

      {/* Incident Form Modal */}
      {showModal && (
        <form onSubmit={handleReport} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-bold text-base text-slate-900">Record Crop Damage Incident</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name *</label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Wheat, Cotton, Mustard"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Calamity / Incident Type *</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="" disabled>Select incident type</option>
                <option value="Hailstorm">Hailstorm (ओलावृष्टि)</option>
                <option value="Flood">Inundation / Flood (बाढ़ / जलभराव)</option>
                <option value="Drought">Severe Drought / Dry Spell (सूखा)</option>
                <option value="Cyclone">Cyclone / Gale Winds (तूफान)</option>
                <option value="Pest Attack">Widespread Pest / Locust Attack (कीट प्रकोप)</option>
                <option value="Frost">Ground Frost / Cold Wave (पाला)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Calamity *</label>
              <input
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Affected Land Area (Acres) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={affectedAreaAcres}
                onChange={(e) => setAffectedAreaAcres(e.target.value)}
                placeholder="e.g. 2.5"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Crop Loss % *</label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={estimatedLossPercent}
                onChange={(e) => setEstimatedLossPercent(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop Stage During Loss</label>
              <input
                type="text"
                value={cropStageAtDamage}
                onChange={(e) => setCropStageAtDamage(e.target.value)}
                placeholder="e.g. Flowering or Maturity"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Attach Geo-Tagged Damage Photograph</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 file:text-rose-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Field Survey Number</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Survey #45/2. Water standing 2 feet deep in field."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
            >
              Save Damage Record
            </button>
          </div>
        </form>
      )}

      {/* Saved Incidents Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your Private Damage Log ({incidents.length})</h2>

        {loading ? (
          <p className="text-xs text-slate-500 py-10 text-center">Loading damage records...</p>
        ) : incidents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-xs text-slate-500 space-y-2">
            <p>No damage incidents logged. Click "Log Damage Incident" if your field has experienced weather loss.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incidents.map((inc) => (
              <div key={inc._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                    {inc.incidentType}
                  </span>
                  <button
                    onClick={() => handleDelete(inc._id)}
                    className="p-1 text-slate-300 hover:text-red-500"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{inc.cropName} Crop Damage</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Date: {new Date(inc.incidentDate).toLocaleDateString()} &bull; Stage: {inc.cropStageAtDamage}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Affected Land Area</span>
                    <span className="font-bold text-slate-800">{inc.affectedAreaAcres} Acres</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Estimated Loss</span>
                    <span className="font-extrabold text-rose-700">{inc.estimatedLossPercent}%</span>
                  </div>
                </div>

                {inc.photos?.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-slate-100 max-h-48 bg-slate-100">
                    <img src={inc.photos[0]} alt="Damage photograph" className="w-full h-full object-cover" />
                  </div>
                )}

                {inc.notes && (
                  <p className="text-xs text-slate-600 bg-sand-50 p-2.5 rounded-xl border border-sand-200">
                    {inc.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insurance options and official support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">Pradhan Mantri Fasal Bima Yojana (PMFBY)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Covers notified food, oilseed and horticultural crops against non-preventable natural calamities, pests and disease. Check crop and season notification with your bank or state portal before paying premium.</p>
          <a href="https://pmfby.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700">Official PMFBY portal <ExternalLink className="w-3.5 h-3.5" /></a>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
          <h3 className="text-base font-bold text-slate-900">How to get disaster support</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Report localized damage promptly to your lending bank, insurance company or CSC. For state disaster relief, contact the District Collector or emergency response office and retain revenue records and photographs.</p>
          <a href="https://pmfby.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700">Open official PMFBY application and status portal <ExternalLink className="w-3.5 h-3.5" /></a>
        </div>
      </div>

      {/* Official Claim Checklist */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <span>Checklist for Submitting PMFBY Survey Claim</span>
        </h3>
        <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-primary-700 font-bold">&bull;</span>
            <span>Intimate insurance company within 72 hours via the Crop Insurance App or toll-free number 1800-180-1551.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-700 font-bold">&bull;</span>
            <span>Keep your Application / Policy receipt number from the bank or CSC handy.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-700 font-bold">&bull;</span>
            <span>Show the timestamped photos saved in your Mitti Mitra record to the visiting Loss Assessment Surveyor.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-700 font-bold">&bull;</span>
            <span>Obtain a signed copy of the Joint Loss Assessment Survey Report from the visiting surveyor and Patwari.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sprout, Save, Trash2, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { LANGUAGE_OPTIONS, useLanguage } from '../context/LanguageContext.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { api } from '../services/api.js';

export const ProfilePage = () => {
  const { user, profile, updateProfile, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [preferredLanguage, setPreferredLanguage] = useState(lang || 'en');
  const [state, setState] = useState(user?.state || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [village, setVillage] = useState(user?.village || '');

  const [farmSize, setFarmSize] = useState(profile?.farmSize || 2);
  const [sizeUnit, setSizeUnit] = useState(profile?.sizeUnit || 'acres');
  const [soilType, setSoilType] = useState(profile?.soilType || 'Black');
  const [waterSource, setWaterSource] = useState(profile?.waterSource || 'Borewell');
  const [irrigationType, setIrrigationType] = useState(profile?.irrigationType || 'drip');
  const [farmingPractices, setFarmingPractices] = useState(profile?.farmingPractices || 'mixed');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await updateProfile({
        name,
        preferredLanguage,
        state,
        district,
        village,
        farmSize: Number(farmSize),
        sizeUnit,
        soilType,
        waterSource,
        irrigationType,
        farmingPractices
      });
      setLang(preferredLanguage);
      setMessage('Profile and farm configuration saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('CRITICAL ACTION: Are you sure you want to delete your Mitti Mitra account? All soil reports and logs will be permanently deleted.')) {
      return;
    }

    try {
      await api.delete('/auth/account');
      logout();
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Farmer Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, landholding measurements, and soil preferences.
        </p>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}
      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-primary-700" />
            <span>Personal & Contact Info</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred Interface Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                {LANGUAGE_OPTIONS.map((language) => (
                  <option key={language.code} value={language.code}>{language.native}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">District</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Village / Locality</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Farm & Agronomic Configuration */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-primary-700" />
            <span>Farm Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Farm Land Size</label>
              <input
                type="number"
                step="0.1"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Measurement Unit</label>
              <select
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="bigha">Bigha</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Predominant Soil</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Black">Black Soil (Vertisol)</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Red & Yellow">Red & Yellow</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Unknown">Not Sure / Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Primary Irrigation</label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler Irrigation</option>
                <option value="flood">Flood / Furrow</option>
                <option value="rainfed">Rainfed / Dryland</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Water Source</label>
              <input
                type="text"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                placeholder="e.g. Borewell / Canal"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Farming Practice</label>
              <select
                value={farmingPractices}
                onChange={(e) => setFarmingPractices(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="conventional">Conventional (Chemical)</option>
                <option value="organic">Certified Organic</option>
                <option value="natural">Natural / Zero Budget</option>
                <option value="mixed">Mixed (INM)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Account</span>
          </button>
        </div>
      </form>
    </div>
  );
};


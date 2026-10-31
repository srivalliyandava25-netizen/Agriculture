import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Wind,
  Sun,
  CloudRain,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';
import { INDIAN_STATES } from '../constants/indianStates.js';

export const WeatherPage = () => {
  const { user } = useAuth();

  const [state, setState] = useState(user?.state || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [weatherData, setWeatherData] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!state.trim() || !district.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/weather?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
      setWeatherData(data.weather);
      setActiveAlerts(data.activeAlerts || []);
    } catch (err) {
      setError(err.message || 'Live weather data could not be loaded for this location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state || !district.trim()) return undefined;
    const timer = setTimeout(() => {
      fetchWeather();
    }, 700);
    return () => clearTimeout(timer);
  }, [state, district]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold mb-2">
            <Droplets className="w-3.5 h-3.5" />
            <span>Agro-Meteorological Advisory Station</span>
            <VoiceReader text={`Weather station for ${district}${state ? `, ${state}` : ''}. ${weatherData?.current ? `Current temperature is ${weatherData.current.temperature} degrees.` : 'Enter a location to view the forecast.'} Check weather warnings and field advisories below.`} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Weather & Agricultural Advisories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time meteorological conditions calibrated for spraying, sowing, and irrigation management.
          </p>
        </div>

        {/* Location selector */}
        <div className="flex items-center gap-2">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            className="w-44 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((stateName) => (
              <option key={stateName} value={stateName}>{stateName}</option>
            ))}
          </select>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Enter district"
            required
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          />
          <button
            onClick={fetchWeather}
            className="p-2.5 rounded-xl bg-primary-700 text-white hover:bg-primary-800 transition-colors"
            title="Refresh Weather"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {error}
        </div>
      )}

      {loading && !weatherData ? (
        <p className="py-12 text-center text-xs text-slate-500">Loading weather models...</p>
      ) : weatherData ? (
        <div className="space-y-8">
          {/* Active Severe Alerts */}
          {(activeAlerts.length > 0 || weatherData.alerts?.length > 0) && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-300 space-y-3">
              <h3 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Weather Warnings for {district}</span>
              </h3>
              {activeAlerts.map((alert) => (
                <div key={alert._id || `${alert.alertType}-${alert.validUntil}`} className="rounded-xl bg-white/70 border border-rose-200 p-3">
                  <p className="font-bold text-xs text-rose-950">{alert.alertType}</p>
                  <p className="text-xs text-rose-900 leading-relaxed mt-1">{alert.advisory}</p>
                </div>
              ))}
              {weatherData.alerts?.map((alert, index) => (
                <div key={`${alert.type}-${index}`} className="rounded-xl bg-white/70 border border-rose-200 p-3">
                  <p className="font-bold text-xs text-rose-950">{alert.type}</p>
                  <p className="text-xs text-rose-900 leading-relaxed mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Current Conditions Card */}
          <div className="bg-gradient-to-br from-cyan-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest block">
                  {weatherData.district}, {weatherData.state} &bull; Live Station
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black">{weatherData.current.temperature}°C</span>
                  <span className="text-sm text-cyan-200 font-medium capitalize">{weatherData.current.condition}</span>
                </div>
                <p className="text-xs text-slate-300">
                  Feels like {weatherData.current.feelsLike}°C &bull; UV Index: {weatherData.current.uvIndex}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-200">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Humidity</span>
                  <p className="text-xl font-extrabold text-white">{weatherData.current.humidity}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Wind Speed</span>
                  <p className="text-xl font-extrabold text-white">{weatherData.current.windSpeed} km/h</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[11px]">Rain Probability</span>
                  <p className="text-xl font-extrabold text-white">{weatherData.current.rainProbability}%</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Source: {weatherData.metadata.dataSource}</span>
              <span>Updated: {new Date(weatherData.metadata.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Contextual Agricultural Advisories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Foliar Spray Advisory
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">Chemical / Bio-Pesticide Application</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{weatherData.advisories.sprayAdvisory}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Irrigation Scheduling
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">Soil Moisture & Water Conservation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{weatherData.advisories.irrigationAdvisory}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Harvesting Window
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">Field Drying & Produce Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{weatherData.advisories.harvestAdvisory}</p>
            </div>
          </div>

          {/* 5-Day Outlook */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">5-Day Agricultural Forecast Outlook</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {weatherData.forecast.map((fc, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-center space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">{fc.day}</span>
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-primary-700">
                    {fc.rainProbability > 30 ? <CloudRain className="w-5 h-5 text-blue-600" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">{fc.maxTemp}°</span> / <span className="text-slate-500">{fc.minTemp}°</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Rain: {fc.rainProbability}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};


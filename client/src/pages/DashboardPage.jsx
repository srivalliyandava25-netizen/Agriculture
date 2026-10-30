import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Compass,
  Bug,
  Droplets,
  LineChart,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.jsx';
import { SoilNutrientGauge } from '../components/soil/SoilNutrientGauge.jsx';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [latestSoilReport, setLatestSoilReport] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [cropRecords, setCropRecords] = useState([]);
  const [fertilizerAdvisories, setFertilizerAdvisories] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [referralCopied, setReferralCopied] = useState(false);
  const referralCode = user?.referralCode || user?._id?.slice(-8)?.toUpperCase() || '';
  const referralLink = typeof window !== 'undefined' && referralCode
    ? `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`
    : '';

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch latest soil report
      const soilRes = await api.get('/soil/reports?limit=1').catch(() => ({ reports: [] }));
      if (soilRes.reports && soilRes.reports.length > 0) {
        setLatestSoilReport(soilRes.reports[0]);
      }

      // 2. Fetch crop recommendations
      const cropRes = await api.get('/crops/my-recommendations').catch(() => ({ records: [] }));
      setCropRecords(cropRes.records || []);
      if (cropRes.records && cropRes.records.length > 0) {
        setRecommendations(cropRes.records[0].recommendedCrops || []);
      }

      // Fertilizer plans
      const fertilizerRes = await api.get('/fertilizers/my-advisories').catch(() => ({ advisories: [] }));
      setFertilizerAdvisories(fertilizerRes.advisories || []);

      // 3. Fetch weather for user's district
      const state = user?.state;
      const district = user?.district;
      if (state && district) {
        const weatherRes = await api.get(`/weather?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`).catch(() => null);
        if (weatherRes && weatherRes.weather) {
          setWeatherData(weatherRes.weather);
        }
      } else {
        setWeatherData(null);
      }

      // 4. Fetch upcoming activities
      const actRes = await api.get('/activities?status=pending').catch(() => ({ activities: [] }));
      setActivities(actRes.activities || []);

      // 5. Fetch farming expenses
      const expRes = await api.get('/expenses/my-records').catch(() => ({ records: [] }));
      setExpenses(expRes.records || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleCopyReferral = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setReferralCopied(true);
      window.setTimeout(() => setReferralCopied(false), 1800);
    } catch {
      setReferralCopied(false);
    }
  };

  const handleToggleActivity = async (id, currentStatus) => {
    try {
      await api.put(`/activities/${id}`, { completed: !currentStatus });
      setActivities((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to update activity:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-primary-200">
              <Sprout className="w-3.5 h-3.5" />
              <span>Kisan Dashboard • {user?.district}, {user?.state}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('dashboard.welcome')}, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-primary-100 max-w-xl">
              {profile?.farmSize ? `Farm Size: ${profile.farmSize} ${profile.sizeUnit || ''}` : 'Farm size not added'}{profile?.soilType ? ` • Soil: ${profile.soilType}` : ''}{profile?.irrigationType ? ` • Irrigation: ${profile.irrigationType}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <VoiceReader
              text={`Welcome ${user?.name}.${user?.district ? ` Your farm is in ${user.district}${user?.state ? `, ${user.state}` : ''}.` : ''}${profile?.farmSize ? ` Registered farm size is ${profile.farmSize} ${profile.sizeUnit || 'acres'}.` : ''} Check your latest farm information below.`}
              label="Listen Summary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            />
            <button
              onClick={loadDashboardData}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          to="/soil-analysis"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-center group flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Test Soil</span>
        </Link>

        <Link
          to="/crop-recommendation"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-center group flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Find Crops</span>
        </Link>

        <Link
          to="/fertilizer-advisory"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-center group flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Fertilizer Plan</span>
        </Link>

        <Link
          to="/disease-detection"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-center group flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Plant Doctor</span>
        </Link>

        <Link
          to="/calculator"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-center group flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <LineChart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Cost & Profit</span>
        </Link>

        <Link
          to="/market-prices"
          className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-center group flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Mandi Rates</span>
        </Link>
      </div>

      {/* Main Grid: Weather & Soil Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Soil Health Status Widget */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary-700" />
                <span>{t('dashboard.latestSoil')}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {latestSoilReport ? `Sample from ${latestSoilReport.farmLocation} • ${new Date(latestSoilReport.createdAt).toLocaleDateString()}` : 'No soil reports registered yet'}
              </p>
            </div>
            <Link
              to="/soil-analysis"
              className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1"
            >
              <span>{latestSoilReport ? 'New Test' : 'Run Test'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestSoilReport ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-primary-50/70 border border-primary-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-primary-900 uppercase tracking-wider block">Overall Condition</span>
                  <p className="text-sm font-extrabold text-primary-950 mt-0.5">
                    {latestSoilReport.soilHealthStatus?.overallCondition || 'Good Agricultural Condition'}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-primary-800 shadow-sm border border-primary-200">
                  {latestSoilReport.knownSoilType} Soil
                </span>
              </div>

              {/* Quick Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SoilNutrientGauge
                  name="pH Balance"
                  value={latestSoilReport.labMeasurements?.ph}
                  unit=""
                  min={4}
                  max={10}
                  optimalMin={6.0}
                  optimalMax={7.5}
                  rating={latestSoilReport.soilHealthStatus?.phRating}
                />
                <SoilNutrientGauge
                  name="Available Nitrogen"
                  value={latestSoilReport.labMeasurements?.nitrogen}
                  unit="kg/ha"
                  min={100}
                  max={700}
                  optimalMin={280}
                  optimalMax={560}
                  rating={latestSoilReport.soilHealthStatus?.nRating}
                />
                <SoilNutrientGauge
                  name="Available Phosphorus"
                  value={latestSoilReport.labMeasurements?.phosphorus}
                  unit="kg/ha"
                  min={5}
                  max={45}
                  optimalMin={10}
                  optimalMax={25}
                  rating={latestSoilReport.soilHealthStatus?.pRating}
                />
                <SoilNutrientGauge
                  name="Available Potassium"
                  value={latestSoilReport.labMeasurements?.potassium}
                  unit="kg/ha"
                  min={50}
                  max={400}
                  optimalMin={110}
                  optimalMax={280}
                  rating={latestSoilReport.soilHealthStatus?.kRating}
                />
              </div>

              {latestSoilReport.recommendations?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Immediate Actionable Advisory:</span>
                  <p>{latestSoilReport.recommendations[0]}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand-100 text-earth-700 mx-auto flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">{t('dashboard.noSoilReport')}</p>
              <Link
                to="/soil-analysis"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-sm"
              >
                <span>Upload Soil Photo / Enter Lab Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Agro-Weather & Spray Advisory Widget */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-600" />
              <span>{t('dashboard.weatherAlert')}</span>
            </h2>
            <Link to="/weather" className="text-xs font-bold text-primary-700 hover:text-primary-800">
              5-Day Forecast &rarr;
            </Link>
          </div>

          {weatherData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900">{weatherData.current.temperature}°C</span>
                  <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">{weatherData.current.condition}</p>
                </div>
                <div className="text-right text-xs text-slate-500 space-y-0.5">
                  <p>Humidity: <span className="font-bold text-slate-800">{weatherData.current.humidity}%</span></p>
                  <p>Wind: <span className="font-bold text-slate-800">{weatherData.current.windSpeed} km/h</span></p>
                  <p>Rain: <span className="font-bold text-slate-800">{weatherData.current.rainProbability}%</span></p>
                </div>
              </div>

              {/* Agricultural Spray Advisory Box */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Foliar Spray Advisory</span>
                </span>
                <p className="text-amber-800 leading-relaxed">{weatherData.advisories.sprayAdvisory}</p>
              </div>

              {/* Irrigation Advisory */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1">
                <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-700" />
                  <span>Irrigation Guidance</span>
                </span>
                <p className="text-blue-800 leading-relaxed">{weatherData.advisories.irrigationAdvisory}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">Loading meteorological observations...</p>
          )}
        </div>
      </div>

      {/* Secondary Grid: Recommended Crops & Upcoming Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Crops */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-700" />
                <span>{t('dashboard.recommendedCrops')}</span>
              </h2>
              <p className="text-xs text-slate-500">Agro-climatic suitability matches for your region</p>
            </div>
            <Link to="/crop-recommendation" className="text-xs font-bold text-primary-700 hover:text-primary-800">
              Run Wizard &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 3).map((crop, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-primary-50/40 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{crop.cropName}</h3>
                    <p className="text-[11px] text-slate-500">{crop.plantingWindow} • Duration: {crop.cropDurationDays}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                      {crop.suitabilityScore}% Match
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">₹{crop.estimatedCostPerAcre?.toLocaleString('en-IN')}/acre</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-500">No custom recommendations calculated yet.</p>
                <Link
                  to="/crop-recommendation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:underline"
                >
                  <span>Select Season & Find Crops &rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Farming Tasks & Reminders */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-700" />
                <span>{t('dashboard.upcomingTasks')}</span>
              </h2>
              <p className="text-xs text-slate-500">{activities.length} pending task(s)</p>
            </div>
            <Link to="/calendar" className="text-xs font-bold text-primary-700 hover:text-primary-800">
              Calendar &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {activities.length > 0 ? (
              activities.slice(0, 4).map((act) => (
                <div
                  key={act._id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <button
                    onClick={() => handleToggleActivity(act._id, act.completed)}
                    className="w-5 h-5 rounded-full border border-slate-300 hover:border-primary-600 hover:bg-primary-50 flex items-center justify-center flex-shrink-0 transition-colors"
                    title="Mark task completed"
                  >
                    {act.completed && <CheckCircle2 className="w-4 h-4 text-primary-600" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{act.title}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Due {new Date(act.dueDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {act.activityType}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-500">No scheduled activities for this week.</p>
                <Link
                  to="/calendar"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Full Crop Schedule &rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved fertilizer recommendations */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-green-700" />
                <span>Fertilizer Plans</span>
              </h2>
              <p className="text-xs text-slate-500">Your saved nutrient advisories</p>
            </div>
            <Link to="/fertilizer-advisory" className="text-xs font-bold text-primary-700">Create Plan &rarr;</Link>
          </div>
          {fertilizerAdvisories.length > 0 ? (
            <div className="space-y-3">
              {fertilizerAdvisories.slice(0, 3).map((plan) => (
                <div key={plan._id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-sm text-slate-900">{plan.cropName}</h3>
                    <span className="text-xs text-slate-500">{new Date(plan.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{plan.landArea} {plan.landUnit}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No fertilizer plans saved yet.</p>
          )}
        </div>

        {/* Previous crop recommendation records */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-700" />
                <span>Previous Season Records</span>
              </h2>
              <p className="text-xs text-slate-500">Saved crop recommendations and inputs</p>
            </div>
            <Link to="/crop-recommendation" className="text-xs font-bold text-primary-700">New Plan &rarr;</Link>
          </div>
          {cropRecords.length > 0 ? (
            <div className="space-y-3">
              {cropRecords.slice(0, 3).map((record) => (
                <div key={record._id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-sm text-slate-900">{record.inputs?.season || 'Season not specified'}</h3>
                    <span className="text-xs text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {(record.recommendedCrops || []).slice(0, 3).map((crop) => crop.cropName).join(', ') || 'No crops saved'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No previous-season records saved yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-900">Referral link</label>
            <p className="text-xs text-slate-500 mt-0.5">Invite farmers to join Mitti Mitra</p>
            <input
              value={referralLink || 'Your referral link will appear here'}
              readOnly
              placeholder="Referral link"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              aria-label="Referral link"
            />
          </div>
          <button
            type="button"
            onClick={handleCopyReferral}
            disabled={!referralLink}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {referralCopied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
};


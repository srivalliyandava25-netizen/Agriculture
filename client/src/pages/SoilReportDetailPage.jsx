import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sprout, Printer, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';
import { SoilNutrientGauge } from '../components/soil/SoilNutrientGauge.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const SoilReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.get(`/soil/reports/${id}`);
        setReport(data.report);
      } catch (err) {
        setError(err.message || 'Report not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this soil report?')) return;
    try {
      await api.delete(`/soil/reports/${id}`);
      navigate('/soil-reports');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-xs text-slate-500">Loading Soil Health Card...</div>;
  if (error || !report) return <div className="p-12 text-center text-xs text-red-500">{error || 'Report not found.'}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <VoiceReader
            text={`Soil Report for ${report.farmLocation}. Overall Condition: ${report.soilHealthStatus?.overallCondition}. Recommendations: ${report.recommendations.join('. ')}`}
          />
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
            title="Delete this report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Printable Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Verified Soil Health Card
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">{report.farmLocation}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sample: {report.sampleLocation} • Season: {report.season} • Tested: {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-slate-800 block">Soil Type: {report.knownSoilType}</span>
            <span className="text-xs text-slate-500 block">
              Irrigation: {report.irrigationAvailable ? 'Available' : 'Rainfed'}
            </span>
          </div>
        </div>

        {/* Condition Summary */}
        <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-200">
          <span className="text-xs font-bold text-primary-800 uppercase tracking-wider block">Health Rating</span>
          <p className="text-lg font-extrabold text-primary-950 mt-0.5">
            {report.soilHealthStatus?.overallCondition}
          </p>
        </div>

        {/* Overall soil health score */}
        {report.soilHealthStatus?.score !== null && report.soilHealthStatus?.score !== undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5 items-center p-5 rounded-2xl bg-white border border-slate-200">
            <div className="relative w-32 h-32 mx-auto rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#059669 ${report.soilHealthStatus.score * 3.6}deg, #e2e8f0 0deg)` }}>
              <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{report.soilHealthStatus.score}</span>
                <span className="text-[10px] font-bold text-slate-500">OUT OF 100</span>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Overall soil health score</span>
              <p className="text-lg font-extrabold text-slate-900 mt-1">{report.soilHealthStatus.overallCondition}</p>
              <p className="text-xs text-slate-500 mt-1">Based on {report.soilHealthStatus.availableIndicators || 0} available laboratory indicator(s). Missing indicators are not guessed or included in the score.</p>
            </div>
          </div>
        )}

        {/* Nutrient Gauges */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Chemical Nutrient Evaluation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SoilNutrientGauge
              name="pH Balance"
              value={report.labMeasurements?.ph}
              unit=""
              min={4}
              max={10}
              optimalMin={6.0}
              optimalMax={7.5}
              rating={report.soilHealthStatus?.phRating}
            />
            <SoilNutrientGauge
              name="Available Nitrogen"
              value={report.labMeasurements?.nitrogen}
              unit="kg/ha"
              min={100}
              max={700}
              optimalMin={280}
              optimalMax={560}
              rating={report.soilHealthStatus?.nRating}
            />
            <SoilNutrientGauge
              name="Available Phosphorus"
              value={report.labMeasurements?.phosphorus}
              unit="kg/ha"
              min={5}
              max={45}
              optimalMin={10}
              optimalMax={25}
              rating={report.soilHealthStatus?.pRating}
            />
            <SoilNutrientGauge
              name="Available Potassium"
              value={report.labMeasurements?.potassium}
              unit="kg/ha"
              min={50}
              max={400}
              optimalMin={110}
              optimalMax={280}
              rating={report.soilHealthStatus?.kRating}
            />
            <SoilNutrientGauge
              name="Organic Carbon"
              value={report.labMeasurements?.organicCarbon}
              unit="%"
              min={0.1}
              max={1.5}
              optimalMin={0.5}
              optimalMax={0.75}
              rating={report.soilHealthStatus?.ocRating}
            />
            {report.labMeasurements?.organicCarbon != null && (
              <SoilNutrientGauge
                name="Estimated Organic Matter"
                value={Number((report.labMeasurements.organicCarbon * 1.724).toFixed(2))}
                unit="%"
                min={0.2}
                max={3}
                optimalMin={0.86}
                optimalMax={1.29}
                rating={report.soilHealthStatus?.ocRating}
              />
            )}
            <SoilNutrientGauge
              name="Electrical Conductivity"
              value={report.labMeasurements?.electricalConductivity}
              unit="dS/m"
              min={0.1}
              max={3.0}
              optimalMin={0.2}
              optimalMax={1.0}
              rating={report.soilHealthStatus?.ecRating}
            />
          </div>
        </div>

        {/* Actionable Remedies */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Actionable Improvement Suggestions</h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {report.recommendations?.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {report.labMeasurements?.organicCarbon != null && (
          <p className="text-[10px] text-slate-500">Estimated organic matter uses the common organic carbon × 1.724 conversion. It is derived from laboratory organic carbon and is not a separate measurement.</p>
        )}

        {/* Scientific Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
          <strong>Scientific Reference:</strong> {report.disclaimer}
        </div>
      </div>
    </div>
  );
};


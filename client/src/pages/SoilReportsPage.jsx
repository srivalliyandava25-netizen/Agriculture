import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Trash2, ArrowRight, Eye, Calendar, MapPin, Plus } from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';

export const SoilReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.get('/soil/reports');
      setReports(data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this soil report?')) return;
    try {
      await api.delete(`/soil/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
      setMessage('Soil report removed successfully.');
    } catch (err) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Soil Reports History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track historical changes in soil nutrient values, pH, and organic carbon across your farm plots.
          </p>
        </div>

        <Link
          to="/soil-analysis"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Soil Analysis</span>
        </Link>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

      {loading ? (
        <p className="text-xs text-slate-500 py-12 text-center">Loading soil reports...</p>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-sand-100 text-earth-700 flex items-center justify-center mx-auto">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Soil Reports Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your soil photograph or input laboratory test parameters to generate your first Soil Health Card.
          </p>
          <Link
            to="/soil-analysis"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-sm"
          >
            <span>Start Soil Health Test</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-800 border border-primary-200">
                    {report.knownSoilType} Soil
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{report.farmLocation}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{report.sampleLocation} • {report.season}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-slate-700">
                      <span className="font-bold">Condition: </span>
                      {report.soilHealthStatus?.overallCondition || 'Evaluated'}
                    </p>
                    {report.soilHealthStatus?.score != null && (
                      <span className="flex-shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800">Score {report.soilHealthStatus.score}/100</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    pH: <span className="font-bold">{report.labMeasurements?.ph || 'N/A'}</span> • N: <span className="font-bold">{report.labMeasurements?.nitrogen || 'N/A'} kg/ha</span> • OC: <span className="font-bold">{report.labMeasurements?.organicCarbon || 'N/A'}%</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/soil-reports/${report._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Card</span>
                </Link>

                <button
                  onClick={() => handleDelete(report._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


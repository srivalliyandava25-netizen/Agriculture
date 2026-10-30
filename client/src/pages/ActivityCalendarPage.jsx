import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Sparkles,
  AlertCircle,
  Filter
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const ActivityCalendarPage = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // New activity form modal/inline
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCrop, setNewCrop] = useState('Wheat');
  const [newType, setNewType] = useState('irrigation');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Auto-schedule generator
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [autoCrop, setAutoCrop] = useState('Wheat');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await api.get('/activities');
      setActivities(data.activities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', {
        title: newTitle,
        cropName: newCrop,
        activityType: newType,
        dueDate: newDueDate,
        notes: newNotes
      });
      setShowForm(false);
      setNewTitle('');
      setMessage('New farming activity scheduled with in-app notification reminder.');
      fetchActivities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateSchedule = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/activities/generate-schedule', {
        cropName: autoCrop,
        sowingDate
      });
      setShowAutoModal(false);
      setMessage(data.message);
      fetchActivities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.put(`/activities/${id}`, { completed: !currentStatus });
      setActivities((prev) =>
        prev.map((a) => (a._id === id ? { ...a, completed: !currentStatus } : a))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/activities/${id}`);
      setActivities((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredActivities = activities.filter((a) => {
    if (filter === 'pending') return !a.completed;
    if (filter === 'completed') return a.completed;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Farming Operations Timeline</span>
            <VoiceReader text="Agricultural Activity Calendar. Manage your sowing, irrigation, fertilizer top-dressing, and harvest schedules." />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Farming Activity Calendar & Reminders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Never miss a critical irrigation stage or fertilizer split dose.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAutoModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-50 text-primary-900 border border-primary-200 hover:bg-primary-100 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary-700" />
            <span>Auto-Generate Crop Cycle</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-700 text-white hover:bg-primary-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>
        </div>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

      {/* Auto Schedule Modal Form */}
      {showAutoModal && (
        <div className="bg-primary-50/70 border border-primary-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-primary-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-700" />
              <span>Auto-Generate Full Season Task Calendar</span>
            </h3>
            <button onClick={() => setShowAutoModal(false)} className="text-xs text-slate-400 hover:text-slate-700">Cancel</button>
          </div>
          <p className="text-xs text-primary-900">
            Automatically calculates key milestones: Crown Root Initiation (CRI) irrigation at 21 days, weeding, secondary top dressing, pest inspections, and harvest.
          </p>
          <form onSubmit={handleGenerateSchedule} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop</label>
              <select
                value={autoCrop}
                onChange={(e) => setAutoCrop(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Paddy">Paddy / Rice (धान)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Chickpea">Chickpea (चना)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sowing Date</label>
              <input
                type="date"
                required
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
            <div className="pt-5">
              <button
                type="submit"
                className="w-full px-6 py-2 rounded-xl text-xs font-bold bg-primary-700 text-white hover:bg-primary-800"
              >
                Generate 8 Scheduled Tasks
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manual Task Creation Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-bold text-base text-slate-900">Create New Activity Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Activity Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 2nd Irrigation or Neem Spray"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Task Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="irrigation">Irrigation (सिंचाई)</option>
                <option value="fertilizer">Fertilizer Top Dressing (खाद)</option>
                <option value="weeding">Weeding / Interculture (निराई)</option>
                <option value="pest_monitoring">Pest Monitoring / Spray (कीट निगरानी)</option>
                <option value="sowing">Sowing (बुवाई)</option>
                <option value="harvesting">Harvesting (कटाई)</option>
                <option value="other">Other Farm Task</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Instructions</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. Check soil moisture before turning on borewell motor."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800"
            >
              Save Scheduled Task
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${
                filter === f
                  ? 'bg-primary-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f} ({activities.filter((a) => f === 'all' ? true : f === 'completed' ? a.completed : !a.completed).length})
            </button>
          ))}
        </div>
      </div>

      {/* Activities Timeline List */}
      {loading ? (
        <p className="text-xs text-slate-500 py-12 text-center">Loading calendar tasks...</p>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No scheduled tasks for this filter</h4>
          <p className="text-xs text-slate-500">Add a custom task or click "Auto-Generate Crop Cycle".</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((act) => (
            <div
              key={act._id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4 transition-all ${
                act.completed ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-slate-200/90 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(act._id, act.completed)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    act.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-primary-600 hover:bg-primary-50 text-transparent'
                  }`}
                  title={act.completed ? 'Mark pending' : 'Mark completed'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div>
                  <h4 className={`text-sm font-bold ${act.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {act.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-primary-800">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(act.dueDate).toLocaleDateString()}</span>
                    </span>
                    {act.cropName && <span>&bull; {act.cropName}</span>}
                    {act.notes && <span>&bull; {act.notes}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {act.activityType}
                </span>
                <button
                  onClick={() => handleDelete(act._id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg"
                  title="Delete activity"
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


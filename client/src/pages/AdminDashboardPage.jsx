import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Sprout,
  Bug,
  Compass,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';

export const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'moderation'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const metricsData = await api.get('/admin/metrics');
      setMetrics(metricsData.metrics);
      setRecentLogs(metricsData.recentAuditLogs || []);

      const usersData = await api.get(`/admin/users?search=${encodeURIComponent(userSearch)}`);
      setUsers(usersData.users || []);

      const flaggedData = await api.get('/admin/flagged-posts');
      setFlaggedPosts(flaggedData.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [userSearch]);

  const handleUpdateUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'expert' ? 'farmer' : 'expert';
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setMessage(`User role updated to ${newRole}.`);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      await api.put(`/admin/users/${userId}`, { active: !currentActive });
      setMessage(`User account status updated.`);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleModeratePost = async (postId, action) => {
    try {
      await api.post(`/admin/moderate-post/${postId}`, { action });
      setMessage(`Post ${action === 'approve' ? 'approved' : 'removed permanently'}.`);
      setFlaggedPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time database analytics, farmer accounts management, and content moderation.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          title="Refresh Metrics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview' ? 'bg-primary-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Metrics Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'users' ? 'bg-primary-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Users Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'moderation' ? 'bg-primary-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Moderation Queue ({flaggedPosts.length})
        </button>
      </div>

      {activeTab === 'overview' && metrics && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Real Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{metrics.totalUsers}</p>
              <span className="text-[10px] text-slate-500">{metrics.totalFarmers} Farmers</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Soil Reports</span>
              <p className="text-2xl font-black text-primary-700 mt-1">{metrics.totalSoilReports}</p>
              <span className="text-[10px] text-slate-500">Evaluated</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommendations</span>
              <p className="text-2xl font-black text-blue-700 mt-1">{metrics.totalRecommendations}</p>
              <span className="text-[10px] text-slate-500">Generated</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Disease Analyses</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{metrics.totalDiseaseAnalyses}</p>
              <span className="text-[10px] text-slate-500">Screened</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialist Queries</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{metrics.totalExpertRequests}</p>
              <span className="text-[10px] text-amber-600 font-bold">{metrics.pendingExpertRequests} Pending</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Community Posts</span>
              <p className="text-2xl font-black text-purple-700 mt-1">{metrics.totalCommunityPosts}</p>
              <span className="text-[10px] text-rose-600 font-bold">{metrics.flaggedPosts} Flagged</span>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent System Activity Audit Logs
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div key={log._id} className="pt-2 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{log.action}</span> &bull;{' '}
                    <span className="text-slate-500">{log.userName} ({log.userRole})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900">Registered Users Management</h3>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by name, district, or phone..."
              className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.district}, {u.state}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full capitalize font-bold ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : u.role === 'expert' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.active ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                        {u.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {u.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleUpdateUserRole(u._id, u.role)}
                            className="text-[11px] font-bold text-primary-700 hover:underline"
                          >
                            {u.role === 'expert' ? 'Demote to Farmer' : 'Promote to Expert'}
                          </button>
                          <button
                            onClick={() => handleToggleUserActive(u._id, u.active)}
                            className={`text-[11px] font-bold ${u.active ? 'text-rose-600' : 'text-emerald-600'} hover:underline`}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="text-base font-bold text-slate-900">Reported Content Moderation Queue</h3>
          {flaggedPosts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No reported posts pending review.</p>
          ) : (
            <div className="space-y-4">
              {flaggedPosts.map((p) => (
                <div key={p._id} className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{p.title}</span>
                    <span className="text-[10px] text-rose-800 font-bold">Reason: {p.flagReason}</span>
                  </div>
                  <p className="text-slate-600">{p.content}</p>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleModeratePost(p._id, 'approve')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold"
                    >
                      Approve & Keep
                    </button>
                    <button
                      onClick={() => handleModeratePost(p._id, 'remove')}
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


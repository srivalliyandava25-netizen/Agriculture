import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BookOpen,
  Send,
  Upload,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const AskExpertPage = () => {
  const { requestId } = useParams();
  const { user, isExpert, isAdmin } = useAuth();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Submit form
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState('');
  const [cropName, setCropName] = useState('');
  const [topic, setTopic] = useState('pest_disease');
  const [description, setDescription] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Expert response form
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [preventiveActions, setPreventiveActions] = useState('');

  // Follow-up message
  const [followUpText, setFollowUpText] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);

  // Rating
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const fetchRequests = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = isExpert || isAdmin
        ? await api.get('/experts/expert-feed')
        : await api.get('/experts/my-requests');
      const nextRequests = data.requests || [];
      setRequests(nextRequests);
      setSelectedRequest((current) =>
        current ? nextRequests.find((request) => request._id === current._id) || null : current
      );
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => fetchRequests({ silent: true }), 30000);
    return () => clearInterval(interval);
  }, [isExpert, isAdmin]);

  useEffect(() => {
    if (requestId && requests.length > 0) {
      const linkedRequest = requests.find((request) => request._id === requestId);
      if (linkedRequest) setSelectedRequest(linkedRequest);
    }
  }, [requestId, requests]);

  const handleSelectRequest = async (request) => {
    setSelectedRequest((current) => current?._id === request._id ? null : request);

    if (
      (isExpert || isAdmin) &&
      selectedRequest?._id !== request._id &&
      ['submitted', 'assigned'].includes(request.status)
    ) {
      try {
        const data = await api.post(`/experts/${request._id}/review`, {});
        if (data.request) {
          setSelectedRequest(data.request);
          fetchRequests({ silent: true });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('cropName', cropName);
      formData.append('topic', topic);
      formData.append('description', description);
      formData.append('state', stateName);
      formData.append('district', district);
      if (imageFile) formData.append('image', imageFile);

      await api.post('/experts/consult', formData);
      setShowSubmitModal(false);
      setTitle('');
      setCropName('');
      setDescription('');
      setStateName('');
      setDistrict('');
      setImageFile(null);
      setMessage('Your immediate AI advisory is ready. Ask a follow-up question anytime for another AI answer.');
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExpertRespond = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const data = await api.post(`/experts/${selectedRequest._id}/respond`, {
        diagnosis,
        recommendation,
        preventiveActions
      });
      setSelectedRequest(data.request);
      setMessage('Expert response delivered to farmer.');
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpText.trim() || !selectedRequest || followUpLoading) return;
    setFollowUpLoading(true);
    try {
      const data = await api.post(`/experts/${selectedRequest._id}/message`, {
        message: followUpText
      });
      setSelectedRequest(data.request);
      setFollowUpText('');
    } catch (err) {
      alert(err.message);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleRate = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const data = await api.post(`/experts/${selectedRequest._id}/rate`, {
        rating,
        feedback
      });
      setSelectedRequest(data.request);
      setMessage('Thank you for rating this consultation.');
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Agricultural Extension Service</span>
            <VoiceReader text="Ask an agricultural specialist. Connect with verified agronomists to get answers to your crop health and soil problems." />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ask an Agricultural Specialist
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit farm photographs and field symptoms to receive structured diagnosis and treatment advice.
          </p>
        </div>

        {!isExpert && (
          <button
            onClick={() => setShowSubmitModal(!showSubmitModal)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-700 text-white hover:bg-primary-800 shadow-sm transition-colors"
          >
            <span>Ask a Specialist</span>
          </button>
        )}
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

      {/* Query Submission Modal */}
      {showSubmitModal && (
        <form onSubmit={handleSubmitRequest} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-bold text-base text-slate-900">Submit Field Consultation Request</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unidentified leaf curling on 45-day tomato crop"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop Name</label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Wheat, Tomato, Cotton"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="pest_disease">Pest or Disease Identification</option>
                <option value="soil_issue">Soil Acidity / Nutrient Deficiency</option>
                <option value="fertilizer_deficiency">Fertilizer Calculation Doubt</option>
                <option value="irrigation">Watering / Drainage Problem</option>
                <option value="general">General Agronomy Advisory</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
              <select required value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                <option value="">Select your state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
              <input required value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Your district" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Upload Photo of Crop / Field (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description of Problem *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State when symptoms started, soil type, previous spray applied, and acreage affected..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800"
            >
              Submit to Specialists
            </button>
          </div>
        </form>
      )}

      {/* Nearby agricultural support */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Nearby agricultural support centres</h2>
          <p className="text-xs text-slate-500 mt-1">
            Use the official directories below to find a centre serving your district. Contact details can change, so confirm by phone before visiting.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
            <PhoneCall className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-emerald-950">Kisan Call Centre</h3>
            <p className="text-emerald-900">Toll-free agricultural advice across India:</p>
            <a href="tel:18001801551" className="font-bold text-emerald-800">1800-180-1551</a>
            <a href="https://dackkms.gov.in/" target="_blank" rel="noopener noreferrer" className="block text-primary-700 font-bold">Find local KCC/KVK contact →</a>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 space-y-2">
            <BookOpen className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-blue-950">Krishi Vigyan Kendra</h3>
            <p className="text-blue-900">District-level demonstrations, soil tests, pest diagnosis, and training through ICAR.</p>
            <a href="https://kvk.icar.gov.in/" target="_blank" rel="noopener noreferrer" className="block text-primary-700 font-bold">Search KVK directory →</a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900">District Agriculture Office</h3>
            <p className="text-slate-600">Ask the district Agriculture, Horticulture, or Cooperative office for block-level staff and emergency crop advisories.</p>
            <a href="https://india.gov.in/topics/agriculture" target="_blank" rel="noopener noreferrer" className="block text-primary-700 font-bold">Find government agriculture services →</a>
          </div>
        </div>
      </section>

      {/* Main Consultations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            {isExpert ? 'Assigned Consultations' : 'Your Consultation History'} ({requests.length})
          </h2>

          {loading ? (
            <p className="text-xs text-slate-400 py-6 text-center">Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              No consultation requests found.
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                role="button"
                tabIndex={0}
                aria-expanded={selectedRequest?._id === req._id}
                onClick={() => handleSelectRequest(req)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectRequest(req);
                  }
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRequest?._id === req._id
                    ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                  <span className="text-slate-400">{req.cropName || 'General'}</span>
                  <span className={`px-2 py-0.5 rounded-full ${['answered', 'closed'].includes(req.status) ? 'bg-emerald-100 text-emerald-800' : req.status === 'in_review' || req.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {req.status === 'answered' ? 'Completed' : req.status === 'in_review' ? 'In Review' : req.status === 'assigned' ? 'Assigned' : req.status === 'closed' ? 'Closed' : 'Submitted'}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{req.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{req.description}</p>
                <span className="text-[10px] text-slate-400 block mt-2">
                  Farmer: {req.farmerName} &bull; {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Selected Request Details & Response Thread */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                    {selectedRequest.topic.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{selectedRequest.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Farmer: {selectedRequest.farmerName} &bull; Crop: {selectedRequest.cropName || 'General'} &bull; Location: {[selectedRequest.district, selectedRequest.state].filter(Boolean).join(', ') || 'Not provided'} &bull; Submitted: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                <span className="font-bold block text-slate-900 mb-1">Farmer Query Details:</span>
                {selectedRequest.description}
              </div>

              {selectedRequest.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-64 bg-slate-100">
                  <img src={selectedRequest.imageUrl} alt="Symptom" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Immediate AI Advisory */}
              {selectedRequest.aiResponse?.diagnosis && !selectedRequest.expertResponse?.diagnosis && (
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-sm text-blue-950">Mitti Mitra AI Preliminary Advisory</span>
                    <VoiceReader
                      text={`Diagnosis: ${selectedRequest.aiResponse.diagnosis}. Recommendation: ${selectedRequest.aiResponse.recommendation}. Preventive Actions: ${selectedRequest.aiResponse.preventiveActions}`}
                    />
                  </div>
                  <div>
                    <span className="font-bold text-blue-900 block">Preliminary Assessment:</span>
                    <p className="text-blue-950">{selectedRequest.aiResponse.diagnosis}</p>
                  </div>
                  <div>
                    <span className="font-bold text-blue-900 block">Recommended Next Steps:</span>
                    <p className="text-blue-950">{selectedRequest.aiResponse.recommendation}</p>
                  </div>
                  <div>
                    <span className="font-bold text-blue-900 block">Prevention and Safety:</span>
                    <p className="text-blue-950">{selectedRequest.aiResponse.preventiveActions}</p>
                  </div>
                  <p className="text-[10px] text-blue-700 border-t border-blue-200 pt-2">
                    AI-generated guidance for immediate crop support. Follow approved product labels and seek local agricultural help for severe or rapidly spreading symptoms.
                  </p>
                </div>
              )}

              {/* Specialist Official Response */}
              {selectedRequest.expertResponse?.diagnosis ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Specialist Verified Advice from {selectedRequest.expertResponse.expertName}</span>
                    </span>
                    <VoiceReader
                      text={`Diagnosis: ${selectedRequest.expertResponse.diagnosis}. Recommendation: ${selectedRequest.expertResponse.recommendation}. Preventive Actions: ${selectedRequest.expertResponse.preventiveActions}`}
                    />
                  </div>

                  <div>
                    <span className="font-bold text-emerald-900 block">Pathology / Issue Diagnosis:</span>
                    <p className="text-emerald-950">{selectedRequest.expertResponse.diagnosis}</p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-900 block">Prescribed Action / Treatment:</span>
                    <p className="text-emerald-950">{selectedRequest.expertResponse.recommendation}</p>
                  </div>

                  {selectedRequest.expertResponse.preventiveActions && (
                    <div>
                      <span className="font-bold text-emerald-900 block">Long-Term Prevention:</span>
                      <p className="text-emerald-950">{selectedRequest.expertResponse.preventiveActions}</p>
                    </div>
                  )}

                  <span className="text-[10px] text-emerald-700 block pt-1">
                    Answered: {new Date(selectedRequest.expertResponse.answeredAt).toLocaleString()}
                  </span>
                </div>
              ) : isExpert || isAdmin ? (
                /* Expert Response Submission Box */
                <form onSubmit={handleExpertRespond} className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-blue-950">Record Specialist Medical Advice</h4>
                  <div>
                    <label className="block font-bold text-blue-900 mb-1">Scientific Diagnosis *</label>
                    <textarea
                      rows={2}
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Nutrient deficiency chlorosis or Alternaria fungal blight"
                      className="w-full p-2.5 rounded-xl border border-blue-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-blue-900 mb-1">Recommended Remedial Action *</label>
                    <textarea
                      rows={2}
                      required
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                      placeholder="e.g. Apply 1% Bordeaux spray or foliar Zinc chelate"
                      className="w-full p-2.5 rounded-xl border border-blue-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-blue-900 mb-1">Preventive Cultural Measures</label>
                    <input
                      type="text"
                      value={preventiveActions}
                      onChange={(e) => setPreventiveActions(e.target.value)}
                      placeholder="e.g. Crop rotation, drip disinfection"
                      className="w-full p-2.5 rounded-xl border border-blue-200 text-xs bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-primary-700 text-white hover:bg-primary-800"
                  >
                    Submit Verified Advisory
                  </button>
                </form>
              ) : null}

              {/* Follow-up Message Thread */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-800">Follow-up Discussion Thread</h4>
                <div className="space-y-2">
                  {selectedRequest.followUpMessages?.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700">{m.senderName} ({m.senderRole})</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-800">{m.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendFollowUp} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    placeholder="Ask a clarifying question..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={followUpLoading || !followUpText.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {followUpLoading ? 'AI is answering...' : 'Send'}
                  </button>
                </form>
              </div>

              {/* Farmer Rating if answered */}
              {selectedRequest.status === 'answered' && !selectedRequest.rating && !isExpert && (
                <form onSubmit={handleRate} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <h4 className="font-bold text-slate-800">Was this expert advice helpful?</h4>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 rounded ${rating >= star ? 'text-amber-500' : 'text-slate-300'}`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Optional feedback..."
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button type="submit" className="px-4 py-1.5 rounded-xl font-bold bg-slate-900 text-white text-xs">
                    Submit Rating
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-xs text-slate-500 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p>Select a consultation query from the left to view AI diagnosis and recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


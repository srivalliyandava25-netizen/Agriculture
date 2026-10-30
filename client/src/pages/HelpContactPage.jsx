import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send, CheckCircle2, ExternalLink } from 'lucide-react';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const HelpContactPage = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', topic: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', phone: '', topic: 'General Inquiry', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold">
          <span>Farmer Support</span>
          <VoiceReader text="Help and contact page. Reach our support desk or call the toll-free Kisan Call Centre at 1800-180-1551." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Help & Support Center</h1>
        <p className="text-sm text-slate-600">
          Have questions or need assistance with your soil test or crop analysis? We are here to support you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Send Us a Message</h2>

          {submitted && (
            <Alert
              type="success"
              title="Message Dispatched Successfully!"
              message="Our agricultural support specialist will review your message and reply via phone or SMS within 24 hours."
              onClose={() => setSubmitted(false)}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Topic of Inquiry
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                <option value="Soil Health Test Question">Soil Health Test Question</option>
                <option value="Crop Recommendation Clarification">Crop Recommendation Clarification</option>
                <option value="Plant Disease Treatment Issue">Plant Disease Treatment Issue</option>
                <option value="Government Scheme Application Help">Government Scheme Application Help</option>
                <option value="General Inquiry / Feedback">General Inquiry / Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Question or Farm Details *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your query, crop stage, or village location..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md transition-all text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>

        {/* Helplines and Official Directory */}
        <div className="space-y-6">
          <div className="bg-primary-950 text-white rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-primary-300">
              <PhoneCall className="w-5 h-5" />
              <span>Government Kisan Call Centre</span>
            </h3>
            <p className="text-3xl font-extrabold text-white">1800-180-1551</p>
            <p className="text-xs text-primary-200 leading-relaxed">
              Toll-free 24 hours a day, 7 days a week. Connects directly to agricultural university graduates in 22 regional Indian languages.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">National Agricultural Portals</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://soilhealth.dac.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-primary-700 hover:underline font-semibold"
                >
                  <span>Soil Health Card Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-primary-700 hover:underline font-semibold"
                >
                  <span>PM-KISAN Samman Nidhi Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-primary-700 hover:underline font-semibold"
                >
                  <span>Agmarknet Mandi Price Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-primary-700 hover:underline font-semibold"
                >
                  <span>PMFBY Fasal Bima Insurance</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


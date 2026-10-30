import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PhoneCall, ShieldCheck, HeartHandshake, ExternalLink, Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Mitti<span className="text-primary-400">Mitra</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Mitti Mitra is an open, AI-assisted smart farming and farmer livelihood platform. Dedicated to restoring soil health, cutting unnecessary input costs, promoting sustainable organic agriculture, and empowering rural Indian farmers.
            </p>
            <div className="flex items-center gap-2 text-xs text-primary-400 font-semibold bg-primary-950/60 border border-primary-800/60 px-3 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Scientific ICAR & SAU verified agricultural packages of practices</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Farmer Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/soil-analysis" className="hover:text-primary-400 transition-colors">Soil Health Testing</Link>
              </li>
              <li>
                <Link to="/crop-recommendation" className="hover:text-primary-400 transition-colors">Crop Recommendations</Link>
              </li>
              <li>
                <Link to="/fertilizer-advisory" className="hover:text-primary-400 transition-colors">Fertilizer Calculator</Link>
              </li>
              <li>
                <Link to="/disease-detection" className="hover:text-primary-400 transition-colors">Crop Disease Doctor</Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-primary-400 transition-colors">Cultivation Cost Calculator</Link>
              </li>
              <li>
                <Link to="/market-prices" className="hover:text-primary-400 transition-colors">Mandi Prices & Trends</Link>
              </li>
            </ul>
          </div>

          {/* Livelihood & Sustainability */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Livelihood & Policy</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/schemes" className="hover:text-primary-400 transition-colors">Government Schemes</Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-primary-400 transition-colors">Organic Farming Guides</Link>
              </li>
              <li>
                <Link to="/insurance" className="hover:text-primary-400 transition-colors">Disaster & Crop Insurance</Link>
              </li>
              <li>
                <Link to="/ask-expert" className="hover:text-primary-400 transition-colors">Ask an Agricultural Expert</Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-primary-400 transition-colors">Kisan Chaupal (Community)</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-primary-400 transition-colors">Help & Verified Resources</Link>
              </li>
            </ul>
          </div>

          {/* Official Helplines & Govt Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Kisan Helplines</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-1.5 text-primary-400 font-bold mb-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Kisan Call Centre (KCC)</span>
                </div>
                <p className="text-white font-bold text-base">1800-180-1551</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Toll-free 24x7 in 22 regional languages</p>
              </div>

              <div className="space-y-1.5 pt-1 text-slate-400">
                <a
                  href="https://soilhealth.dac.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>Soil Health Card Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>PM-KISAN Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-white transition-colors"
                >
                  <span>PMFBY Insurance</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Mitti Mitra. Built for Indian Agricultural Community.
          </p>
          <p className="text-center md:text-right max-w-xl text-[11px] text-slate-500">
            Disclaimer: Mitti Mitra AI screening provides decision-support information. Always calibrate fertilizer doses with accredited laboratory Soil Health Cards and consult local KVK extension officers for severe infestations.
          </p>
        </div>
      </div>
    </footer>
  );
};


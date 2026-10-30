import React from 'react';
import { Sprout, Target, Shield, HeartHandshake, Award, HelpCircle } from 'lucide-react';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold">
          <span>About Mitti Mitra</span>
          <VoiceReader text="About Mitti Mitra: Dedicated to addressing India's critical agricultural challenges through transparent, accessible agricultural intelligence." />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Indian Farmers Through Science & Sustainable Technology
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Mitti Mitra is built with a singular mission: to make verified agricultural science and economic intelligence accessible to every Indian farmer, regardless of landholding size or language.
        </p>
      </div>

      {/* The Agricultural Crisis */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">The Problem We Are Addressing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1 text-primary-800">1. Severe Soil Degradation & Urea Overuse</h3>
            <p>
              In many agricultural belts of India, the natural N:P:K ratio has severely skewed from the ideal 4:2:1 to over 8:3:1 due to excessive broadcasting of subsidized Urea. This burns up beneficial soil microbes, acidifies soils, and contaminates rural groundwater with toxic nitrates.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1 text-primary-800">2. Asymmetric Market & Price Information</h3>
            <p>
              Farmers routinely face distress sales during peak harvest glut when local APMC mandi prices plunge. Without access to transport economics and nearby market benchmarks, middlemen capture up to 45% of consumer retail value.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1 text-primary-800">3. Stubble Burning & Air Pollution</h3>
            <p>
              Over 35 million tons of crop residue are burned annually in Northern and Western India, producing dangerous smog while destroying valuable macro-nutrients and burning billions of earthworms that naturally aerate soil.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1 text-primary-800">4. Misleading Digital Promises</h3>
            <p>
              Many mobile apps irresponsibly claim to measure chemical soil nutrients (pH, nitrogen, potassium) from phone photos. Mitti Mitra rejects unscientific shortcuts and insists on verified laboratory test calibration.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sand-50 border border-sand-200 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Scientific Integrity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recommendations adhere strictly to Indian Council of Agricultural Research (ICAR) packages of practices and state agricultural university manuals.
          </p>
        </div>

        <div className="bg-sand-50 border border-sand-200 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Farmer Data Privacy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your soil tests, damage incident records, and financial calculations remain strictly private to your account. We never sell or share farmer data.
          </p>
        </div>

        <div className="bg-sand-50 border border-sand-200 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Rural Accessibility</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Designed mobile-first with high contrast, fast loading for low-bandwidth rural 3G/4G connections, bilingual Hindi/English text, and voice synthesis.
          </p>
        </div>
      </div>
    </div>
  );
};


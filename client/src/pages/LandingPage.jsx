import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Bug,
  LineChart,
  FileText,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Leaf,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const LandingPage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      title: 'Scientific Soil Health Report',
      description: 'Upload soil pictures and physical lab test values. Get accredited ICAR nutrient ratings for pH, N-P-K, and organic carbon with custom soil improvement steps.',
      link: '/soil-analysis',
      badge: 'Core Tool'
    },
    {
      icon: <Compass className="w-6 h-6 text-blue-600" />,
      title: 'AI Crop Recommendation Engine',
      description: 'Select the most profitable and climate-resilient crops suited to your agro-climatic zone, season, irrigation type, and soil texture.',
      link: '/crop-recommendation',
      badge: 'AI Powered'
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: 'Balanced Fertilizer & INM Advisory',
      description: 'Cut unnecessary fertilizer expenses. Balance chemical DAP/Urea with organic FYM, Vermicompost, and biofertilizers for higher yields.',
      link: '/fertilizer-advisory',
      badge: 'Cost Saver'
    },
    {
      icon: <Bug className="w-6 h-6 text-amber-600" />,
      title: 'Leaf Doctor & Disease Detection',
      description: 'Instant visual screening of affected leaves. Detect blights, rusts, and viruses with symptom breakdowns and verified organic & chemical cures.',
      link: '/disease-detection',
      badge: 'Vision AI'
    },
    {
      icon: <LineChart className="w-6 h-6 text-purple-600" />,
      title: 'Cultivation Cost & Profit Calculator',
      description: 'Calculate real net profits, input expenses, and break-even mandi selling prices before investing your hard-earned money.',
      link: '/calculator',
      badge: 'Finance'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
      title: 'Live APMC Mandi Prices',
      description: 'Track daily modal prices across major Indian mandis with transport economics to choose the most remunerative marketplace.',
      link: '/market-prices',
      badge: 'Market'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Provide Farm Details or Soil Test',
      description: 'Enter your farm location, known soil type, and optional laboratory Soil Health Card numbers or upload a soil photograph.'
    },
    {
      number: '02',
      title: 'Receive Tailored Agricultural Intelligence',
      description: 'Our engine applies verified ICAR crop rotation matrices, nutrient balance formulas, and agro-weather advisories to your land.'
    },
    {
      number: '03',
      title: 'Optimize Expenses & Maximize Net Profit',
      description: 'Apply targeted nutrients, protect crops from diseases, schedule timely irrigations, and sell at the best mandi prices.'
    }
  ];

  const faqs = [
    {
      q: 'Can a smartphone photograph accurately measure soil chemical pH and NPK?',
      a: 'No. Mitti Mitra strictly respects scientific realities: a normal photograph can only estimate physical surface texture, color, and moisture. Exact chemical measurements require wet-chemistry laboratory testing. Mitti Mitra lets you input your Soil Health Card values for precise fertilizer prescriptions while distinguishing visual observations from measured lab results.'
    },
    {
      q: 'Does Mitti Mitra work in local Indian languages?',
      a: 'Yes! Mitti Mitra offers full bilingual support in English and Hindi (हिन्दी) along with text-to-speech voice reading for farmers with limited literacy.'
    },
    {
      q: 'Are the crop and fertilizer recommendations based on verified research?',
      a: 'Yes. All recommendation rules, nutrient deficiency thresholds, and planting windows are derived from standard Indian Council of Agricultural Research (ICAR) and State Agricultural Universities (SAU) packages of practices.'
    },
    {
      q: 'How does the platform help reduce farming costs?',
      a: 'Farmers frequently over-apply Urea and DAP by up to 30%, which wastes money and degrades soil biology. Mitti Mitra calculates exact split-dose requirements and promotes low-cost organic alternatives like green manuring and biofertilizers.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-primary-50/60 via-sand-50/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/80 border border-primary-200 text-primary-900 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-700" />
              <span>{t('tagline')}</span>
              <VoiceReader text="Welcome to Mitti Mitra. Better Soil. Better Crops. Better Livelihood. AI-Powered Smart Farming Platform." />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                to="/soil-analysis"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md shadow-primary-700/20 transition-all text-sm sm:text-base group"
              >
                <span>{t('hero.analyzeSoil')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/crop-recommendation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-primary-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-sm sm:text-base"
              >
                <span>Find Suitable Crops</span>
              </Link>
              <Link
                to="/features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 hover:text-slate-900 hover:bg-sand-100 transition-all text-sm sm:text-base"
              >
                <span>{t('hero.exploreFeatures')}</span>
              </Link>
            </div>

            {/* Quick Stat Highlights */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-black text-primary-700">15+ Crops</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">ICAR Verified Packages</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-black text-primary-700">25-30%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Average Fertilizer Savings</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-black text-primary-700">100%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Free & Accessible to Farmers</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <p className="text-2xl font-black text-primary-700">24x7</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Bilingual Voice & Text Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Smart Farming in 3 Easy Steps</h2>
          <p className="text-sm text-slate-500 mt-2">Designed specifically for Indian farmers with simple, intuitive workflows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-4xl font-black text-primary-100 block mb-3">{step.number}</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Comprehensive Ecosystem</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Everything a Farmer Needs to Succeed</h2>
          </div>
          <Link to="/features" className="text-sm font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1">
            <span>Explore all features</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Link
              key={i}
              to={f.link}
              className="group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-primary-50 group-hover:text-primary-800 transition-colors">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
              <div className="mt-4 flex items-center text-xs font-bold text-primary-700 group-hover:translate-x-1 transition-transform">
                <span>Access module &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Environmental & Livelihood Twin Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Environmental Pillar */}
          <div className="bg-gradient-to-br from-emerald-900 to-primary-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-300">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black">Environmental & Soil Protection</h3>
              <p className="text-sm text-primary-100 leading-relaxed">
                Decades of excessive chemical fertilizer application and open-field stubble burning have depleted organic carbon in Indian soils below 0.5%.
              </p>
              <ul className="space-y-2.5 text-sm text-primary-200 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span>Preserves vital soil biology, earthworms, and microbial fungal networks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span>Zero-burn crop residue management eliminates deadly winter smog.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span>Micro-irrigation and mulching guidelines conserve 40% groundwater.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/sustainability"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-white text-emerald-950 px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <span>Learn Organic Practices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Livelihood Pillar */}
          <div className="bg-gradient-to-br from-amber-900 to-earth-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black">Farmer Livelihood & Economic Growth</h3>
              <p className="text-sm text-amber-100 leading-relaxed">
                Agriculture is sustainable only when the farming family earns an honorable, predictable income and escapes cycles of rural debt.
              </p>
              <ul className="space-y-2.5 text-sm text-amber-200 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Real cultivation expense tracking avoids under-pricing at harvest.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Mandi price comparison guides profitable transport decisions.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Direct links to PM-KISAN, PMFBY, and KCC subsidies and loans.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/calculator"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-white text-amber-950 px-4 py-2.5 rounded-xl hover:bg-amber-50 transition-colors"
                >
                  <span>Open Profit Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Pilot Testimonials (Explicitly labeled as pilot sample testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilot Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">What Pilot Farmers Say</h2>
          <p className="text-xs text-slate-500 mt-1">(Sample feedback collected from initial field testing in Pune and Ludhiana)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "Earlier I blindly used 3 bags of DAP and 4 bags of Urea per acre. Mitti Mitra's fertilizer calculator showed my soil already had high potassium and recommended a targeted split nitrogen dose with vermicompost. I saved over ₹3,200 per acre on my wheat crop."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-sm">
                RP
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Ramesh Patel</p>
                <p className="text-xs text-slate-500">Wheat & Vegetable Farmer, Pune, Maharashtra</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "The leaf doctor accurately identified early blight on my tomato crop and warned me against spraying in the windy afternoon. The suggested neem oil and Trichoderma treatment controlled the fungus within 6 days."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-earth-100 text-earth-800 font-bold flex items-center justify-center text-sm">
                GS
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Gurpreet Singh</p>
                <p className="text-xs text-slate-500">Horticultural Farmer, Khanna, Punjab</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-emerald-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to make smarter, profitable farming decisions?</h2>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl mx-auto">
            Join Mitti Mitra today. No hidden charges. Test your soil, explore recommended crops, and protect your harvest.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl font-bold text-primary-950 bg-white hover:bg-primary-50 shadow-md transition-all text-sm sm:text-base"
            >
              Register Your Farm Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all text-sm sm:text-base"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Compass,
  Bug,
  LineChart,
  TrendingUp,
  Droplets,
  Calendar,
  Users,
  Award,
  ShieldAlert,
  BookOpen,
  Scale,
  Volume2,
  RotateCw,
  Recycle,
  Languages,
  ArrowRight
} from 'lucide-react';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const FeaturesPage = () => {
  const featureList = [
    {
      title: 'Soil Health Card & Analysis',
      desc: 'Combines smartphone photographic observations with accredited Soil Health Card N-P-K and pH titration values to generate visual nutrient health reports and remedial soil improvement plans.',
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      link: '/soil-analysis',
      tag: 'Soil Health'
    },
    {
      title: 'AI Crop Recommendation Engine',
      desc: 'Recommends top 4 suitable crops and alternative crops ranked by suitability score based on your agro-climatic zone, season, soil type, pH, irrigation availability, and previous crop rotation.',
      icon: <Compass className="w-6 h-6 text-blue-600" />,
      link: '/crop-recommendation',
      tag: 'Recommendation'
    },
    {
      title: 'Integrated Fertilizer & Nutrient Advisory',
      desc: 'Calculates exact basal and split application requirements for DAP, Urea, and MOP while promoting Integrated Nutrient Management (INM) with Farmyard Manure (FYM) and biofertilizers.',
      icon: <Sprout className="w-6 h-6 text-green-600" />,
      link: '/fertilizer-advisory',
      tag: 'Fertilizers'
    },
    {
      title: 'Leaf Doctor Disease Diagnosis',
      desc: 'Instant visual screening of crop leaves and fruits. Identifies blight, rust, mosaic, and mildew with confidence scores, organic bio-pesticide recipes, and inconclusive handling for unclear images.',
      icon: <Bug className="w-6 h-6 text-amber-600" />,
      link: '/disease-detection',
      tag: 'Plant Protection'
    },
    {
      title: 'Agro-Meteorological Weather & Advisories',
      desc: 'Real-time temperature, rainfall probability, humidity, and critical contextual farming advisories for spraying (wind check), irrigation timing, and severe weather warnings.',
      icon: <Droplets className="w-6 h-6 text-cyan-600" />,
      link: '/weather',
      tag: 'Weather'
    },
    {
      title: 'Cultivation Cost & Net Profit Calculator',
      desc: 'Detailed itemized expense calculator covering seeds, fertilizers, labour, machinery, irrigation, and transport with break-even price calculation and crop comparisons.',
      icon: <LineChart className="w-6 h-6 text-purple-600" />,
      link: '/calculator',
      tag: 'Economics'
    },
    {
      title: 'APMC Mandi Prices & Transport Economics',
      desc: 'Searchable mandi price benchmarks across major Indian markets with price trends (rising/stable/falling) and freight calculators comparing local vs distant markets.',
      icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
      link: '/market-prices',
      tag: 'Markets'
    },
    {
      title: 'Verified Government Agricultural Schemes',
      desc: 'Search and apply for central and state schemes including PM-KISAN, PMFBY crop insurance, PKVY organic subsidies, Soil Health Cards, and PMKSY micro-irrigation.',
      icon: <Award className="w-6 h-6 text-orange-600" />,
      link: '/schemes',
      tag: 'Subsidies'
    },
    {
      title: 'Agricultural Activity Calendar & Reminders',
      desc: 'Personalized crop cycle task planner with automated schedule generation from sowing to harvest (CRI irrigation, weeding, top-dressing, pest monitoring) with in-app reminders.',
      icon: <Calendar className="w-6 h-6 text-indigo-600" />,
      link: '/calendar',
      tag: 'Productivity'
    },
    {
      title: 'Kisan Chaupal Community Forum',
      desc: 'Connect with fellow farmers across India. Ask questions, share practical organic methods, upload pictures, and receive peer solutions in a moderated, respectful environment.',
      icon: <Users className="w-6 h-6 text-sky-600" />,
      link: '/community',
      tag: 'Community'
    },
    {
      title: 'Ask an Agricultural Specialist',
      desc: 'Direct consultation channel with verified agronomists and university experts. Submit photos and descriptions, track status, and receive structured diagnosis.',
      icon: <BookOpen className="w-6 h-6 text-emerald-700" />,
      link: '/ask-expert',
      tag: 'Expertise'
    },
    {
      title: 'Smart Water Management',
      desc: 'Plan crop irrigation using local soil and weather information with drip guidance, rainwater harvesting ideas, schedules, and practical water-saving tips.',
      icon: <Droplets className="w-6 h-6 text-blue-600" />,
      link: '/water',
      tag: 'Water'
    },
    {
      title: 'Crop Rotation Planner',
      desc: 'Plan successive cereal, legume, and cover crops to protect soil fertility, interrupt pest cycles, and improve long-term productivity across seasons.',
      icon: <RotateCw className="w-6 h-6 text-indigo-600" />,
      link: '/sustainability',
      tag: 'Rotation'
    },
    {
      title: 'Crop Waste to Useful Products',
      desc: 'Convert crop residues safely into compost, vermicompost, mulch, manure, or suitable reused materials instead of burning agricultural waste.',
      icon: <Recycle className="w-6 h-6 text-green-700" />,
      link: '/sustainability',
      tag: 'Waste Reuse'
    },
    {
      title: 'Local Language & Voice Assistant',
      desc: 'Use the complete website in supported Indian regional languages and listen to important agricultural guidance with the built-in voice reader.',
      icon: <Languages className="w-6 h-6 text-violet-600" />,
      link: '/',
      tag: 'Accessibility'
    },
    {
      title: 'Affordable Farming Comparison',
      desc: 'Compare conventional and sustainable farming with farm-specific estimates of costs, fertiliser use, water consumption, expected yield, and potential profit.',
      icon: <Scale className="w-6 h-6 text-green-700" />,
      link: '/affordable-farming',
      tag: 'Farm Economics'
    },
    {
      title: 'Crop Insurance & Disaster Loss Logging',
      desc: 'Maintain private timestamped photographic records of crop damage from floods, hailstorms, or droughts with affected acreage for seamless PMFBY insurance claims.',
      icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
      link: '/insurance',
      tag: 'Disaster Relief'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold">
          <span>Feature Matrix</span>
          <VoiceReader text="Explore all the powerful features of Mitti Mitra, from soil testing to mandi prices and expert consultation." />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Complete Full-Stack Agricultural Platform
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Every tool is designed to work seamlessly together, providing Indian farmers with actionable guidance at every step of the cultivation cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((f, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
            <div className="pt-6">
              <Link
                to={f.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800"
              >
                <span>Open {f.title.split(' ')[0]} Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


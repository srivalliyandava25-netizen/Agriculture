import React, { useState } from 'react';
import { Droplets, CheckCircle2, Waves, Sprout, CloudRain, CalendarDays, Gauge } from 'lucide-react';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const WaterManagementPage = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [landArea, setLandArea] = useState('');
  const [irrigationMethod, setIrrigationMethod] = useState('');
  const [soilCondition, setSoilCondition] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');

  // Baseline water requirement in mm
  const CROP_WATER_DATA = {
    Wheat: { mm: 500, floodReqLakhLitres: 40, dripSavings: 45 },
    Paddy: { mm: 1300, floodReqLakhLitres: 104, dripSavings: 50 },
    Cotton: { mm: 800, floodReqLakhLitres: 64, dripSavings: 40 },
    Sugarcane: { mm: 1800, floodReqLakhLitres: 144, dripSavings: 55 },
    Tomato: { mm: 550, floodReqLakhLitres: 44, dripSavings: 60 },
    Maize: { mm: 600, floodReqLakhLitres: 48, dripSavings: 40 }
  };

  const cropData = CROP_WATER_DATA[selectedCrop];
  const area = Number(landArea) || 0;
  const hasInputs = Boolean(cropData && area > 0 && irrigationMethod && soilCondition && weatherCondition);
  const totalWaterRequirement = cropData ? cropData.floodReqLakhLitres * area : 0;
  const waterSavedDrip = cropData ? Math.round((totalWaterRequirement * cropData.dripSavings) / 100) : 0;
  const irrigationInterval = soilCondition === 'Sandy' ? 'every 2–3 days' : soilCondition === 'Clay' ? 'every 5–7 days' : 'every 3–5 days';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold">
          <Droplets className="w-3.5 h-3.5" />
          <span>Micro-Irrigation & Water Conservation</span>
          <VoiceReader text="Water management and micro-irrigation station. Learn about drip irrigation, crop water requirements, and government subsidy schemes." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Agricultural Water Management
        </h1>
        <p className="text-sm text-slate-500">
          Save up to 55% groundwater, cut electric pumping bills, and double crop water productivity.
        </p>
      </div>

      {/* Interactive Water Savings Calculator */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Crop Water Requirement Calculator</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="" disabled>Select crop</option>
              {Object.keys(CROP_WATER_DATA).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Land Area (Acres)</label>
            <input
              type="number"
              step="0.5"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              placeholder="Enter land area"
              min="0.1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Method</label>
            <select
              value={irrigationMethod}
              onChange={(e) => setIrrigationMethod(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="" disabled>Select method</option>
              <option value="drip">Drip Irrigation (टपक)</option>
              <option value="sprinkler">Sprinkler (फव्वारा)</option>
              <option value="flood">Conventional Flood</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Soil Condition</label>
            <select value={soilCondition} onChange={(e) => setSoilCondition(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="" disabled>Select soil condition</option>
              <option value="Sandy">Sandy / Fast draining</option>
              <option value="Loamy">Loamy / Medium draining</option>
              <option value="Clay">Clay / Slow draining</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Weather Ahead</label>
            <select value={weatherCondition} onChange={(e) => setWeatherCondition(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="" disabled>Select forecast</option>
              <option value="Dry">Hot and dry</option>
              <option value="Normal">Normal / mild</option>
              <option value="Rain">Rain expected</option>
            </select>
          </div>
        </div>

        {/* Output Metrics */}
        {hasInputs && <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seasonal Water Requirement</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{totalWaterRequirement} Lakh Litres</span>
            <span className="text-[10px] text-slate-500">Approx {cropData.mm} mm water depth</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200">
            <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">Water Saved with Drip</span>
            <span className="text-2xl font-black text-cyan-950 block mt-1">{waterSavedDrip} Lakh Litres</span>
            <span className="text-[10px] text-cyan-800 font-bold">{cropData.dripSavings}% Water Reduction</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Fertilizer Efficiency Gain</span>
            <span className="text-2xl font-black text-emerald-950 block mt-1">+25% - 30%</span>
            <span className="text-[10px] text-emerald-800">Via drip fertigation delivery</span>
          </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-xs text-cyan-950">
              <CalendarDays className="w-4 h-4 mb-2" />
              <strong className="block mb-1">Irrigation schedule</strong>
              Irrigate {irrigationInterval}, preferably in the early morning or evening. Check 5 cm below the soil surface before watering.
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-950">
              <Gauge className="w-4 h-4 mb-2" />
              <strong className="block mb-1">Method guidance</strong>
              {irrigationMethod === 'drip' ? 'Run emitters near the active root zone and flush filters regularly.' : irrigationMethod === 'sprinkler' ? 'Avoid midday spraying and strong winds to reduce evaporation and drift.' : 'Use level borders or furrows and stop as soon as the root zone is moist.'}
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
              <CloudRain className="w-4 h-4 mb-2" />
              <strong className="block mb-1">Weather adjustment</strong>
              {weatherCondition === 'Rain' ? 'Skip irrigation before forecast rain; ensure field drainage and pond outlets are clear.' : weatherCondition === 'Dry' ? 'Increase monitoring during hot, dry periods, but avoid fixed excess irrigation.' : 'Maintain the planned schedule and adjust for observed soil moisture.'}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <strong className="text-sm text-slate-900">Growth-stage timing</strong>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs text-slate-700">
              <div className="rounded-xl bg-white border border-slate-200 p-3"><strong>Establishment</strong><br />Light, frequent watering; keep the seedbed evenly moist.</div>
              <div className="rounded-xl bg-white border border-slate-200 p-3"><strong>Vegetative</strong><br />Water consistently to support canopy and root growth.</div>
              <div className="rounded-xl bg-white border border-slate-200 p-3"><strong>Flowering</strong><br />Avoid stress and check moisture more frequently.</div>
              <div className="rounded-xl bg-white border border-slate-200 p-3"><strong>Fruiting</strong><br />Maintain even moisture; reduce water near harvest if recommended for the crop.</div>
            </div>
          </div>
          {soilCondition === 'Sandy' && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
              Sandy soil drains quickly: irrigate more often in smaller amounts and check moisture depth rather than relying only on the surface.
            </div>
          )}
          {weatherCondition === 'Rain' && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-900">
              Rain is expected: postpone irrigation until useful rainfall is confirmed, then check field drainage before applying water again.
            </div>
          )}
        </div>}
      </div>

      {/* Rainwater Harvesting & Farm Pond (Khet Talab) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
            <Waves className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Farm Pond (खेत तालाब) Rain Harvesting</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Excavating a 20m x 20m x 3m farm pond lined with 500-micron LDPE geomembrane sheet stores 12 lakh litres of monsoon runoff, enough for 2 critical life-saving irrigations during dry spells.
          </p>
          <div className="p-3 bg-cyan-50 rounded-xl text-xs text-cyan-950 border border-cyan-200">
            <strong>Government Subsidy:</strong> Up to 50% subsidy (₹75,000 to ₹1.2 lakh) under Rashtriya Krishi Vikas Yojana (RKVY) and state farm pond schemes.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Organic Straw Mulching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Spreading a 3-inch layer of paddy straw or sugarcane trash over crop beds suppresses weed germination, cuts surface soil water evaporation by 40%, and reduces soil temperature by 3-5°C during hot afternoons.
          </p>
          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-950 border border-emerald-200">
            <strong>Long-term Gain:</strong> The mulch naturally degrades in 90 days, adding 2-3 tons of organic humus per acre back into the topsoil.
          </div>
        </div>
      </div>
    </div>
  );
};


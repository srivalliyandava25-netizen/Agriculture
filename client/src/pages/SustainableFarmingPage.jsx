import React, { useState, useEffect } from 'react';
import {
  Sprout,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Droplets,
  Leaf,
  ShieldAlert,
  Layers,
  ArrowRight,
  Recycle
} from 'lucide-react';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const SustainableFarmingPage = () => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  // Crop rotation planner mini-tool
  const [prevCrop, setPrevCrop] = useState('');
  const [rotationSeason, setRotationSeason] = useState('');
  const [soilType, setSoilType] = useState('');
  const [waterAvailability, setWaterAvailability] = useState('');
  const [rotationPlan, setRotationPlan] = useState(null);
  const [residueCrop, setResidueCrop] = useState('');
  const [residueAmount, setResidueAmount] = useState('');
  const [residueUse, setResidueUse] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const data = await api.get('/sustainability/guides');
        setGuides(data.guides || []);
        if (data.guides && data.guides.length > 0) {
          setSelectedGuide(data.guides[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const handleCalculateRotation = (e) => {
    e.preventDefault();
    const isCereal = /paddy|rice|wheat/i.test(prevCrop);
    const isPulse = /chickpea|lentil|gram|mung|green gram/i.test(prevCrop);
    const isVegetable = /tomato/i.test(prevCrop);
    const sequences = {
      Kharif: isCereal
        ? ['Green gram / moong', 'Chickpea / lentil', 'Sunnhemp green manure']
        : ['Wheat or mustard', 'Chickpea / lentil', 'Green manure'],
      Rabi: isPulse
        ? ['Maize or pearl millet', 'Green gram or black gram', 'Sunnhemp']
        : ['Chickpea / lentil', 'Green gram', 'Maize or mustard'],
      Zaid: waterAvailability === 'Low'
        ? ['Green gram / cowpea', 'Sesame', 'Sunnhemp green manure']
        : ['Green gram / cowpea', 'Vegetable approved for the local market', 'Sunnhemp green manure']
    };

    setRotationPlan({
      sequence: sequences[rotationSeason] || [],
      advice: isVegetable
        ? 'Follow tomato with a non-solanaceous crop to reduce disease carryover. Avoid potato, brinjal, and chilli in the immediate next season.'
        : isPulse
          ? 'After a pulse, use a cereal crop with moderate nutrient demand before returning to another legume. This balances nitrogen use and crop diversity.'
          : isCereal
            ? 'A cereal crop uses substantial nitrogen. Follow it with a nodulating pulse to support nitrogen fixation and break cereal pest cycles.'
            : 'Alternate crop families, keeping legumes and non-legumes in separate consecutive seasons.',
      soilNote: soilType === 'Sandy'
        ? 'Use shorter-duration pulses and protect sandy soil with compost and residue mulch.'
        : soilType === 'Clay'
          ? 'Avoid field traffic when clay soil is wet and choose crops suited to the field drainage.'
          : 'Maintain organic matter with compost, residue mulch, and a green-manure cover.',
      reviewNote: `Plan starts after ${prevCrop}. Confirm varieties and sowing dates with the district KVK or agricultural officer for local conditions.`
    });
  };

  const handleResiduePlan = (e) => {
    e.preventDefault();
    const tonnes = Number(residueAmount);
    if (!residueCrop || !Number.isFinite(tonnes) || tonnes <= 0) return;

    const plans = {
      'Paddy / wheat straw': {
        products: ['Surface mulch using a straw spreader or Happy Seeder', 'Aerated compost mixed with manure and starter nitrogen', 'Dry livestock bedding with proper removal and hygiene'],
        agricultureUse: 'Mixing straw into soil can temporarily immobilize nitrogen. Apply after shredding, keep moist and aerated, or manage the residue in mulch without heavy incorporation.',
        warning: 'Do not burn standing or loose stubble. Remove diseased straw; do not spread infested residue over healthy fields.'
      },
      'Sugarcane trash': {
        products: ['Moisture-retaining mulch between cane rows', 'Compost with cane leaves, press mud or manure', 'Approved local mulching or bioenergy collection scheme'],
        agricultureUse: 'Keep trash away from ratoon crowns and irrigation emitters. Shred thick leaves and monitor rodents during storage.',
        warning: 'Avoid uncontrolled collection fires and check that local dealers accept residue before transport.'
      },
      'Cotton stalks': {
        products: ['Shred and compost after mixing with manure', 'Use authorized farm residue collection systems', 'Mulch only after pest and stalk-borer inspection'],
        agricultureUse: 'Tall woody stalks decompose slowly. Chip them, maintain moisture, and do not return diseased or infested stalks to fields.',
        warning: 'Do not burn or spread stalks carrying bollworm, wilt or other major disease symptoms.'
      },
      'Husk / shells / pod waste': {
        products: ['Dry carbon-rich compost ingredient', 'Surface mulch in small quantities', 'Approved animal bedding or local biomass collection'],
        agricultureUse: 'Mix high-carbon husk with nitrogen-rich manure rather than using it alone. Screens and dust control are important during handling.',
        warning: 'Store dry residues away from ignition sources; use only residues known to be free of chemicals or contamination.'
      }
    };

    setResidueUse({ ...plans[residueCrop], tonnes, residueCrop });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Natural & Regenerative Agriculture</span>
          <VoiceReader text="Sustainable and organic farming guides. Learn vermicomposting, in-situ green manuring, zero-burn stubble management, and crop rotation." />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sustainable & Organic Agriculture
        </h1>
        <p className="text-sm text-slate-500">
          Restore natural soil biology, reduce costly chemical inputs, and transition to profitable regenerative farming.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Compost & vermicompost', 'Build nutrient-rich soil amendments from farm and kitchen waste.', Layers],
          ['Green manure & rotation', 'Restore nitrogen, disrupt pest cycles, and improve soil structure.', RotateCw],
          ['Natural pest management', 'Use traps, beneficial insects, and botanical sprays instead of routine chemicals.', ShieldAlert],
          ['Reuse farm waste', 'Convert residues, manure, husk, and crop stalks into mulch or compost.', Leaf]
        ].map(([title, text, Icon]) => (
          <div key={title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <Icon className="w-6 h-6 text-emerald-700 mb-3" />
            <h2 className="font-bold text-slate-900 text-sm">{title}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Crop residue reuse planner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center"><Recycle className="w-5 h-5" /></div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Turn Crop Waste into Useful Products</h2>
            <p className="text-xs text-slate-500 mt-1">Choose residue type and quantity to identify practical compost, mulch, and agricultural reuse options.</p>
          </div>
        </div>
        <form onSubmit={handleResiduePlan} className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop residue</label>
            <select required value={residueCrop} onChange={(e) => setResidueCrop(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
              <option value="" disabled>Select residue type</option>
              <option>Paddy / wheat straw</option>
              <option>Sugarcane trash</option>
              <option>Cotton stalks</option>
              <option>Husk / shells / pod waste</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Available amount (tonnes)</label>
            <input required type="number" min="0.1" step="0.1" value={residueAmount} onChange={(e) => setResidueAmount(e.target.value)} placeholder="e.g. 2" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-700 text-white text-xs font-bold">Plan reuse <ArrowRight className="w-4 h-4" /></button>
        </form>
        {residueUse && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950">
              <strong className="block mb-2">Useful products</strong>
              <ul className="space-y-1">{residueUse.products.map((item) => <li key={item}>• {item}</li>)}</ul>
              <p className="mt-3 font-bold">Estimated available material: {residueUse.tonnes} tonnes</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-950">
              <strong className="block mb-2">Agricultural reuse</strong>{residueUse.agricultureUse}
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
              <strong className="block mb-2">Safety and quality</strong>{residueUse.warning}
            </div>
          </div>
        )}
      </section>

      {/* Interactive Crop Rotation Planner */}
      <div className="bg-gradient-to-r from-emerald-900 via-primary-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-primary-300 uppercase tracking-widest flex items-center gap-1.5">
            <RotateCw className="w-4 h-4" />
            <span>Interactive Crop Rotation Planner</span>
          </span>
          <h2 className="text-2xl font-black">Plan Next Season's Crop Sequence</h2>
          <p className="text-xs text-primary-100 max-w-2xl leading-relaxed">
            Continuous monocropping exhausts specific soil layers and breeds specialized pest cycles. Select your previous harvest to get an agronomically sound rotation recommendation.
          </p>
        </div>

        <form onSubmit={handleCalculateRotation} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-primary-200 mb-1">Previous Harvested Crop</label>
            <select
              value={prevCrop}
              onChange={(e) => setPrevCrop(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            >
              <option value="" disabled className="text-slate-900">Select previous crop</option>
              <option value="Paddy / Rice" className="text-slate-900">Paddy / Rice (धान)</option>
              <option value="Wheat" className="text-slate-900">Wheat (गेहूं)</option>
              <option value="Cotton" className="text-slate-900">Cotton (कपास)</option>
              <option value="Sugarcane" className="text-slate-900">Sugarcane (गन्ना)</option>
              <option value="Tomato" className="text-slate-900">Tomato (टमाटर)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-200 mb-1">Upcoming Season</label>
            <select
              value={rotationSeason}
              onChange={(e) => setRotationSeason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            >
              <option value="" disabled className="text-slate-900">Select season</option>
              <option value="Rabi" className="text-slate-900">Rabi (Winter Season)</option>
              <option value="Kharif" className="text-slate-900">Kharif (Monsoon Season)</option>
              <option value="Zaid" className="text-slate-900">Zaid (Summer Short Catch Season)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-200 mb-1">Soil Condition</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm"
              required
            >
              <option value="" disabled className="text-slate-900">Select soil</option>
              <option value="Loamy" className="text-slate-900">Loamy</option>
              <option value="Sandy" className="text-slate-900">Sandy / light</option>
              <option value="Clay" className="text-slate-900">Clay / heavy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-200 mb-1">Water Availability</label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm"
              required
            >
              <option value="" disabled className="text-slate-900">Select water access</option>
              <option value="Low" className="text-slate-900">Low / rainfed</option>
              <option value="Moderate" className="text-slate-900">Moderate</option>
              <option value="Reliable" className="text-slate-900">Reliable irrigation</option>
            </select>
          </div>

          <div className="pt-6 sm:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="w-full px-6 py-2.5 rounded-xl text-xs font-bold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              Evaluate Rotation Match
            </button>
          </div>
        </form>

        {rotationPlan && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rotationPlan.sequence.map((crop, index) => {
                return (
                  <div key={`${crop}-${index}`} className="relative rounded-2xl border border-white/20 bg-white/10 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-300">{index === 0 ? 'Immediately' : `Season ${index + 1}`}</span>
                    <h3 className="font-black text-white mt-1">{crop}</h3>
                    <p className="text-[11px] text-primary-100 mt-2">{index === 2 ? 'Restore soil, suppress weeds, and add organic residue.' : 'Alternate crop family and use the local seasonal sowing window.'}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-white/10 border border-white/20 p-4"><strong className="text-white block mb-1">Why this sequence helps</strong><span className="text-primary-100">{rotationPlan.advice}</span></div>
              <div className="rounded-xl bg-white/10 border border-white/20 p-4"><strong className="text-white block mb-1">Soil and water adjustment</strong><span className="text-primary-100">{rotationPlan.soilNote}</span></div>
              <div className="rounded-xl bg-white/10 border border-white/20 p-4"><strong className="text-white block mb-1">Before sowing</strong><span className="text-primary-100">{rotationPlan.reviewNote}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Sustainable Agriculture Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guides Sidebar */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Verified Educational Guides ({guides.length})
          </h3>
          <div className="space-y-2">
            {guides.map((g) => (
              <button
                key={g._id}
                onClick={() => setSelectedGuide(g)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedGuide?._id === g._id
                    ? 'border-primary-600 bg-primary-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 block mb-1">
                  {g.category.replace('_', ' ')}
                </span>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{g.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{g.shortDescription}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Guide Details */}
        <div className="lg:col-span-2">
          {selectedGuide ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    {selectedGuide.category.replace('_', ' ')}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedGuide.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{selectedGuide.shortDescription}</p>
                </div>
                <VoiceReader
                  text={`${selectedGuide.title}. Materials required: ${selectedGuide.materialsRequired.join(', ')}. Instructions: ${selectedGuide.stepByStepInstructions.join('. ')}`}
                />
              </div>

              {/* Materials Required */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-sm text-slate-900">Materials Required</h4>
                <ul className="space-y-1.5 text-slate-700">
                  {selectedGuide.materialsRequired.map((mat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary-700 font-bold">•</span>
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step by Step Instructions */}
              <div className="space-y-3">
                <h4 className="font-bold text-base text-slate-900">Step-by-Step Procedure</h4>
                <div className="space-y-2.5">
                  {selectedGuide.stepByStepInstructions.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-white flex items-start gap-3 text-xs">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environmental Benefits */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Environmental & Agronomic Benefits</span>
                </h4>
                <ul className="space-y-1 text-emerald-900">
                  {selectedGuide.environmentalBenefits.map((ben, i) => (
                    <li key={i}>&bull; {ben}</li>
                  ))}
                </ul>
              </div>

              {/* Estimated Costs & Precautions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Estimated Investment:</span>
                  <p className="text-slate-600">{selectedGuide.estimatedCost}</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Key Precautions:</span>
                  <p className="text-amber-800">{selectedGuide.precautions.join(' ')}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center">Select a guide from the left to read.</p>
          )}
        </div>
      </div>
    </div>
  );
};


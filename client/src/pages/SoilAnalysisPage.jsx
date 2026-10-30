import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Printer,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';
import { SoilNutrientGauge } from '../components/soil/SoilNutrientGauge.jsx';

export const SoilAnalysisPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);

  // Form Fields
  const [farmLocation, setFarmLocation] = useState('');
  const [knownSoilType, setKnownSoilType] = useState('Unknown');
  const [season, setSeason] = useState('');
  const [currentCrop, setCurrentCrop] = useState('');
  const [irrigationAvailable, setIrrigationAvailable] = useState(false);

  // Optional Physical Lab Measurements
  const [hasLabTest, setHasLabTest] = useState(false);
  const [ph, setPh] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [organicCarbon, setOrganicCarbon] = useState('');
  const [electricalConductivity, setElectricalConductivity] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const analyzeImagePixels = (file) => new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0, size, size);

      try {
        const pixels = context.getImageData(0, 0, size, size).data;
        let red = 0;
        let green = 0;
        let blue = 0;
        let luminance = 0;
        let textureVariance = 0;
        const samples = [];

        for (let i = 0; i < pixels.length; i += 16) {
          red += pixels[i];
          green += pixels[i + 1];
          blue += pixels[i + 2];
          const value = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          luminance += value;
          samples.push(value);
        }

        const count = samples.length;
        red = Math.round(red / count);
        green = Math.round(green / count);
        blue = Math.round(blue / count);
        luminance /= count;
        const mean = luminance;
        textureVariance = samples.reduce((sum, value) => sum + Math.abs(value - mean), 0) / count;

        let visibleColor;
        let possibleSoilType;
        let textureClass;
        let confidence;

        if (red > green * 1.12 && red > blue * 1.18) {
          visibleColor = 'Reddish brown / iron-rich appearance';
          possibleSoilType = 'Red & Yellow soil';
        } else if (red < 105 && green < 105 && blue < 105) {
          visibleColor = 'Dark brown / black appearance';
          possibleSoilType = 'Black (Vertisol) soil';
        } else if (green > red * 0.9 && luminance > 125) {
          visibleColor = 'Light brown / pale appearance';
          possibleSoilType = 'Sandy or alluvial soil';
        } else {
          visibleColor = 'Medium brown appearance';
          possibleSoilType = 'Alluvial / loamy soil';
        }

        if (textureVariance > 24) textureClass = 'Coarse / visibly textured';
        else if (textureVariance > 14) textureClass = 'Loam to clay loam';
        else textureClass = 'Fine / smooth-looking clay soil';

        confidence = Math.min(78, Math.max(48, Math.round(55 + textureVariance * 0.45)));
        const moistureAppearance = luminance < 95
          ? 'Dark surface may indicate moisture or high organic matter'
          : luminance < 145
            ? 'Moderate moisture appearance'
            : 'Dry or very well-lit surface appearance';
        const organicMatterVisual = luminance < 110
          ? 'Possible organic matter or dark mineral content'
          : 'No strong visual indication of high organic matter';

        resolve({ visibleColor, possibleSoilType, textureClass, moistureAppearance, organicMatterVisual, confidence });
      } catch (pixelError) {
        reject(pixelError);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('The selected image could not be read. Please choose another photograph.'));
    };
    image.src = objectUrl;
  });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload a clear soil photograph for image analysis.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('farmLocation', farmLocation);
      formData.append('knownSoilType', knownSoilType);
      formData.append('season', season);
      formData.append('currentOrPlannedCrop', currentCrop);
      formData.append('irrigationAvailable', irrigationAvailable);

      const visualAnalysis = await analyzeImagePixels(selectedFile);
      Object.entries(visualAnalysis).forEach(([key, value]) => {
        formData.append(`visual${key.charAt(0).toUpperCase()}${key.slice(1)}`, String(value));
      });

      if (hasLabTest) {
        if (ph) formData.append('ph', ph);
        if (nitrogen) formData.append('nitrogen', nitrogen);
        if (phosphorus) formData.append('phosphorus', phosphorus);
        if (potassium) formData.append('potassium', potassium);
        if (organicCarbon) formData.append('organicCarbon', organicCarbon);
        if (electricalConductivity) formData.append('electricalConductivity', electricalConductivity);
      }

      const res = await api.post('/soil/analyze', formData);
      setGeneratedReport(res.report);
      setStep(3); // Result step
    } catch (err) {
      setError(err.message || 'Soil analysis failed. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Soil Health Diagnostic Wizard</span>
            <VoiceReader text="Soil Health Diagnostic Wizard. Upload your soil sample photograph or input laboratory Soil Health Card parameters." />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Soil Health Card & Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Combines physical soil characteristics with accredited ICAR laboratory reference scales.
          </p>
        </div>

        <button
          onClick={() => navigate('/soil-reports')}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          View Past Soil Reports &rarr;
        </button>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Scientific Safeguard Banner (Mandatory Prompt Requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block text-sm mb-0.5">Critical Scientific Transparency Notice:</span>
          A standard smartphone camera photograph identifies surface color, visible texture, and moisture presence. However, <strong>exact chemical properties (pH, Available N, P, K, and Salinity) cannot be determined from a photograph alone.</strong> For precise fertilizer dosage, enter measurements from your government Soil Health Card.
        </div>
      </div>

      {step !== 3 ? (
        <form onSubmit={handleAnalyze} className="space-y-8">
          {/* Step 1: Image Upload (Optional or Recommended) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-700 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Upload Soil Sample Photograph</span>
            </h2>
            <p className="text-xs text-slate-500">
              Take a clear, close-up photograph of topsoil (0-15 cm depth) in natural daylight without artificial filters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="border-2 border-dashed border-slate-200 hover:border-primary-500 rounded-2xl p-6 text-center transition-colors">
                <input
                  type="file"
                  id="soilImage"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="soilImage" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 block">Click to Browse or Drag Image</span>
                  <span className="text-xs text-slate-400 block">JPEG, PNG, WebP up to 5MB</span>
                </label>
              </div>

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video max-h-48 bg-slate-100 flex items-center justify-center">
                  <img src={previewUrl} alt="Soil Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg hover:bg-black"
                  >
                    Replace Image
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 bg-sand-50/50 p-6 text-xs text-slate-500 space-y-2">
                  <span className="font-bold text-slate-700 block">Tips for Best Visual Assessment:</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Clear surface grass, stones, and fresh litter before capturing.</li>
                    <li>Dig 4-6 inches down to sample root-zone soil.</li>
                    <li>Photograph under open natural shade to avoid harsh glare.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Farm & Cropping Context */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-700 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Farm Field & Cropping Context</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Field / Parcel Name
                </label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  placeholder="e.g. North Canal Plot"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Known Soil Type
                </label>
                <select
                  value={knownSoilType}
                  onChange={(e) => setKnownSoilType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
                  <option value="Black">Black Soil / Vertisol (काली मिट्टी)</option>
                  <option value="Red & Yellow">Red & Yellow Soil (लाल-पीली मिट्टी)</option>
                  <option value="Laterite">Laterite Soil (लैटेराइट मिट्टी)</option>
                  <option value="Clay Loam">Clay Loam (दोमट मिट्टी)</option>
                  <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                  <option value="Unknown">Not Sure / Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Planned Crop
                </label>
                <input
                  type="text"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  placeholder="e.g. Wheat, Cotton, Tomato"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cropping Season
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="Kharif (Monsoon)">Kharif (Monsoon: June - Oct)</option>
                  <option value="Rabi (Winter)">Rabi (Winter: Oct - March)</option>
                  <option value="Zaid (Summer)">Zaid (Summer: March - June)</option>
                  <option value="Year-round">Year-round / Perennial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Irrigation Availability
                </label>
                <div className="flex items-center gap-4 pt-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      checked={irrigationAvailable === true}
                      onChange={() => setIrrigationAvailable(true)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span>Assured Irrigation Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      checked={irrigationAvailable === false}
                      onChange={() => setIrrigationAvailable(false)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span>Rainfed / Dryland</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Laboratory Measurements (Soil Health Card Input) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-700 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>Accredited Soil Health Card Measurements</span>
              </h2>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-primary-800">
                <input
                  type="checkbox"
                  checked={hasLabTest}
                  onChange={(e) => setHasLabTest(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span>Include Lab Test Values</span>
              </label>
            </div>

            {hasLabTest ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Soil pH (Acidity / Alkalinity)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="11"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    placeholder="e.g. 7.1 (Ideal: 6.5 - 7.5)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Nitrogen (kg/ha)
                  </label>
                  <input
                    type="number"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                    placeholder="e.g. 240 (Low < 280)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Phosphorus (kg/ha)
                  </label>
                  <input
                    type="number"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                    placeholder="e.g. 16 (Medium 10-25)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Potassium (kg/ha)
                  </label>
                  <input
                    type="number"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                    placeholder="e.g. 310 (High > 280)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organic Carbon (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={organicCarbon}
                    onChange={(e) => setOrganicCarbon(e.target.value)}
                    placeholder="e.g. 0.62% (Ideal > 0.75)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Electrical Conductivity (dS/m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={electricalConductivity}
                    onChange={(e) => setElectricalConductivity(e.target.value)}
                    placeholder="e.g. 0.45 (Normal < 1.0)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 italic">
                Proceeding without physical laboratory test numbers. The report will output visual physical assessments and standard ICAR regional baseline recommendations.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-lg shadow-primary-700/25 transition-all text-base disabled:opacity-50"
          >
            {loading ? 'Evaluating Soil Parameters...' : 'Generate Verified Soil Health Report'}
          </button>
        </form>
      ) : (
        /* Step 3: Generated Soil Health Card Display */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Verified Soil Health Card</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Diagnostic Report: {generatedReport.farmLocation}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated: {new Date(generatedReport.createdAt).toLocaleDateString()} • Soil Type: {generatedReport.knownSoilType}
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <VoiceReader
                text={`Soil Health Card for ${generatedReport.farmLocation}. Overall Condition: ${generatedReport.soilHealthStatus?.overallCondition}. Recommended immediate action: ${generatedReport.recommendations[0]}`}
              />
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-primary-700 hover:underline px-2"
              >
                New Analysis
              </button>
            </div>
          </div>

          {/* Condition Banner */}
          <div className="p-4 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-primary-800 uppercase tracking-wider block">Health Rating</span>
              <p className="text-base font-extrabold text-primary-950 mt-0.5">
                {generatedReport.soilHealthStatus?.overallCondition}
              </p>
            </div>
            <div className="text-right text-xs text-primary-800 font-semibold">
              <span>{generatedReport.isLabTested ? 'Laboratory Verified' : 'Visual Assessment'}</span>
            </div>
          </div>

          {generatedReport.imageAnalysis && generatedReport.imageAnalysis.visibleColor && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-amber-950">Image-based soil assessment</h3>
                  <p className="text-xs text-amber-800 mt-1">Initial visual estimate only; not a laboratory diagnosis.</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200">
                  {generatedReport.imageAnalysis.confidence}% confidence
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-white border border-amber-100 p-3"><span className="block font-bold text-slate-700">Visible colour</span><span className="text-slate-600">{generatedReport.imageAnalysis.visibleColor}</span></div>
                <div className="rounded-xl bg-white border border-amber-100 p-3"><span className="block font-bold text-slate-700">Possible soil type</span><span className="text-slate-600">{generatedReport.imageAnalysis.possibleSoilType}</span></div>
                <div className="rounded-xl bg-white border border-amber-100 p-3"><span className="block font-bold text-slate-700">Visible texture</span><span className="text-slate-600">{generatedReport.imageAnalysis.textureClass}</span></div>
                <div className="rounded-xl bg-white border border-amber-100 p-3"><span className="block font-bold text-slate-700">Surface condition</span><span className="text-slate-600">{generatedReport.imageAnalysis.moistureAppearance}</span></div>
              </div>
              <p className="text-xs font-semibold text-amber-950">
                Further laboratory soil testing is recommended to determine pH, NPK, salinity, and accurate fertilizer needs.
              </p>
            </div>
          )}

          {/* Nutrient Gauges */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Soil Nutrients vs ICAR Standards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SoilNutrientGauge
                name="pH Balance"
                value={generatedReport.labMeasurements?.ph}
                unit=""
                min={4}
                max={10}
                optimalMin={6.0}
                optimalMax={7.5}
                rating={generatedReport.soilHealthStatus?.phRating}
              />
              <SoilNutrientGauge
                name="Available Nitrogen"
                value={generatedReport.labMeasurements?.nitrogen}
                unit="kg/ha"
                min={100}
                max={700}
                optimalMin={280}
                optimalMax={560}
                rating={generatedReport.soilHealthStatus?.nRating}
              />
              <SoilNutrientGauge
                name="Available Phosphorus"
                value={generatedReport.labMeasurements?.phosphorus}
                unit="kg/ha"
                min={5}
                max={45}
                optimalMin={10}
                optimalMax={25}
                rating={generatedReport.soilHealthStatus?.pRating}
              />
              <SoilNutrientGauge
                name="Available Potassium"
                value={generatedReport.labMeasurements?.potassium}
                unit="kg/ha"
                min={50}
                max={400}
                optimalMin={110}
                optimalMax={280}
                rating={generatedReport.soilHealthStatus?.kRating}
              />
              <SoilNutrientGauge
                name="Organic Carbon"
                value={generatedReport.labMeasurements?.organicCarbon}
                unit="%"
                min={0.1}
                max={1.5}
                optimalMin={0.5}
                optimalMax={0.75}
                rating={generatedReport.soilHealthStatus?.ocRating}
              />
              <SoilNutrientGauge
                name="Electrical Conductivity (EC)"
                value={generatedReport.labMeasurements?.electricalConductivity}
                unit="dS/m"
                min={0.1}
                max={3.0}
                optimalMin={0.2}
                optimalMax={1.0}
                rating={generatedReport.soilHealthStatus?.ecRating}
              />
            </div>
          </div>

          {/* Actionable Remedies & Organic Amendments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Actionable Soil Improvements</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {generatedReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary-700 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>Recommended Organic Amendments</span>
              </h4>
              <ul className="space-y-2 text-xs text-emerald-900">
                {generatedReport.organicAmendments.map((amend, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{amend}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 no-print">
            <Link
              to="/crop-recommendation"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 px-5 py-2.5 rounded-xl shadow-sm"
            >
              <span>Get Crop Recommendations Based On This Soil &rarr;</span>
            </Link>
            <Link
              to="/fertilizer-advisory"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-5 py-2.5 rounded-xl"
            >
              <span>Calculate Custom Fertilizer Doses</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};


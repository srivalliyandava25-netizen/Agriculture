import { SoilReport } from '../models/SoilReport.js';
import { getFileUrl } from '../services/storageService.js';
import { SOIL_STANDARDS } from '../services/fertilizerEngine.js';

export const uploadAndAnalyzeSoil = async (req, res, next) => {
  try {
    const {
      farmLocation,
      sampleLocation,
      currentOrPlannedCrop,
      season,
      irrigationAvailable,
      knownSoilType,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon,
      electricalConductivity,
      sulfur,
      zinc,
      iron,
      visualVisibleColor,
      visualTextureClass,
      visualMoistureAppearance,
      visualOrganicMatterVisual,
      visualPossibleSoilType,
      visualConfidence
    } = req.body;

    const file = req.file;
    const imageUrl = file ? getFileUrl(file, req) : '';

    // Scientific image visual assessment simulation
    let visibleColor = 'Medium Brown / Loamy';
    let textureClass = 'Loam to Clay Loam';
    let moistureAppearance = 'Moderate moisture retention';
    let organicMatterVisual = 'Visible biological residues present';
    let possibleSoilType = knownSoilType && knownSoilType !== 'Unknown' ? knownSoilType : 'Alluvial / Loamy';
    let confidence = 75;

    if (visualVisibleColor) visibleColor = visualVisibleColor;
    if (visualTextureClass) textureClass = visualTextureClass;
    if (visualMoistureAppearance) moistureAppearance = visualMoistureAppearance;
    if (visualOrganicMatterVisual) organicMatterVisual = visualOrganicMatterVisual;
    if (visualPossibleSoilType) possibleSoilType = visualPossibleSoilType;
    if (visualConfidence !== undefined && visualConfidence !== '') {
      confidence = Math.max(0, Math.min(100, Number(visualConfidence) || 0));
    }

    if (file && !visualVisibleColor) {
      const lowerName = file.originalname.toLowerCase();
      if (lowerName.includes('black') || lowerName.includes('dark')) {
        visibleColor = 'Dark Brown / Black Vertisol';
        textureClass = 'Clayey / Deep Black Soil';
        possibleSoilType = 'Black (Regur)';
        confidence = 82;
      } else if (lowerName.includes('red') || lowerName.includes('yellow')) {
        visibleColor = 'Reddish Brown (Iron oxide rich)';
        textureClass = 'Sandy Clay Loam';
        possibleSoilType = 'Red & Yellow';
        confidence = 80;
      }
    }

    const isLabTested = Boolean(
      (ph !== undefined && ph !== '') ||
      (nitrogen !== undefined && nitrogen !== '') ||
      (phosphorus !== undefined && phosphorus !== '') ||
      (potassium !== undefined && potassium !== '')
    );

    const labMeasurements = {
      ph: ph !== undefined && ph !== '' ? Number(ph) : null,
      nitrogen: nitrogen !== undefined && nitrogen !== '' ? Number(nitrogen) : null,
      phosphorus: phosphorus !== undefined && phosphorus !== '' ? Number(phosphorus) : null,
      potassium: potassium !== undefined && potassium !== '' ? Number(potassium) : null,
      organicCarbon: organicCarbon !== undefined && organicCarbon !== '' ? Number(organicCarbon) : null,
      electricalConductivity: electricalConductivity !== undefined && electricalConductivity !== '' ? Number(electricalConductivity) : null,
      sulfur: sulfur !== undefined && sulfur !== '' ? Number(sulfur) : null,
      zinc: zinc !== undefined && zinc !== '' ? Number(zinc) : null,
      iron: iron !== undefined && iron !== '' ? Number(iron) : null
    };

    // Evaluate health ratings against ICAR standard criteria
    const soilHealthStatus = {
      overallCondition: 'Moderate - Requires Balanced Nutrition',
      phRating: 'Not Tested',
      nRating: 'Not Tested',
      pRating: 'Not Tested',
      kRating: 'Not Tested',
      ocRating: 'Not Tested',
      ecRating: 'Not Tested'
    };

    const recommendations = [];
    const organicAmendments = [];

    if (isLabTested) {
      if (labMeasurements.ph !== null) {
        if (labMeasurements.ph < SOIL_STANDARDS.ph.acidic) {
          soilHealthStatus.phRating = `Acidic (${labMeasurements.ph})`;
          recommendations.push(`Apply agricultural limestone (CaCO3) @ 1.5 - 2 tons/acre to correct soil acidity and unlock phosphorus.`);
        } else if (labMeasurements.ph > SOIL_STANDARDS.ph.alkaline) {
          soilHealthStatus.phRating = `Alkaline/Sodic (${labMeasurements.ph})`;
          recommendations.push(`Apply agricultural gypsum (CaSO4·2H2O) @ 1 - 1.5 tons/acre followed by leaching to displace sodium.`);
        } else {
          soilHealthStatus.phRating = `Optimal (${labMeasurements.ph})`;
          recommendations.push(`Soil pH (${labMeasurements.ph}) is in the ideal neutral zone for nutrient availability.`);
        }
      }

      if (labMeasurements.nitrogen !== null) {
        if (labMeasurements.nitrogen < SOIL_STANDARDS.nitrogen.low) {
          soilHealthStatus.nRating = `Low (${labMeasurements.nitrogen} kg/ha)`;
          recommendations.push(`Available Nitrogen is deficient (<280 kg/ha). Include pulse cover crops in rotation and split urea doses.`);
          organicAmendments.push('Incorporate green manure crop (Dhaincha or Sunnhemp) at 45 days before primary crop.');
        } else if (labMeasurements.nitrogen > SOIL_STANDARDS.nitrogen.high) {
          soilHealthStatus.nRating = `High (${labMeasurements.nitrogen} kg/ha)`;
          recommendations.push(`Available Nitrogen is abundant. Curtail synthetic nitrogen application to prevent excessive vegetative growth.`);
        } else {
          soilHealthStatus.nRating = `Medium / Adequate (${labMeasurements.nitrogen} kg/ha)`;
        }
      }

      if (labMeasurements.phosphorus !== null) {
        if (labMeasurements.phosphorus < SOIL_STANDARDS.phosphorus.low) {
          soilHealthStatus.pRating = `Low (${labMeasurements.phosphorus} kg/ha)`;
          recommendations.push(`Phosphorus is low. Apply Phosphate Solubilizing Bacteria (PSB) bio-fertilizer and basal DAP.`);
        } else {
          soilHealthStatus.pRating = `Sufficient (${labMeasurements.phosphorus} kg/ha)`;
        }
      }

      if (labMeasurements.potassium !== null) {
        if (labMeasurements.potassium < SOIL_STANDARDS.potassium.low) {
          soilHealthStatus.kRating = `Low (${labMeasurements.potassium} kg/ha)`;
          recommendations.push(`Potassium is low. Apply MOP (Muriate of Potash) to build pest resistance and grain weight.`);
        } else {
          soilHealthStatus.kRating = `Sufficient (${labMeasurements.potassium} kg/ha)`;
        }
      }

      if (labMeasurements.organicCarbon !== null) {
        if (labMeasurements.organicCarbon < SOIL_STANDARDS.organicCarbon.low) {
          soilHealthStatus.ocRating = `Deficient (${labMeasurements.organicCarbon}%)`;
          organicAmendments.push('Apply 4-5 tons of well-rotted Farmyard Manure (FYM) or 2 tons Vermicompost per acre annually.');
        } else {
          soilHealthStatus.ocRating = `Good (${labMeasurements.organicCarbon}%)`;
        }
      }

      soilHealthStatus.overallCondition = 'Scientifically Evaluated via Lab Parameters';
    } else {
      recommendations.push('Visual observations are preliminary. Submit a physical soil sample to your district KVK or Soil Testing Laboratory for accredited Soil Health Card NPK figures.');
      organicAmendments.push('Maintain minimum 3 tons/acre FYM annually to safeguard natural soil organic matter.');
    }

    const indicatorScores = [];
    if (labMeasurements.ph !== null) {
      indicatorScores.push(labMeasurements.ph >= 6 && labMeasurements.ph <= 7.5 ? 100 : labMeasurements.ph >= 5.5 && labMeasurements.ph <= 8.5 ? 70 : 40);
    }
    if (labMeasurements.nitrogen !== null) {
      indicatorScores.push(labMeasurements.nitrogen < SOIL_STANDARDS.nitrogen.low ? 50 : labMeasurements.nitrogen <= SOIL_STANDARDS.nitrogen.high ? 100 : 65);
    }
    if (labMeasurements.phosphorus !== null) {
      indicatorScores.push(labMeasurements.phosphorus < SOIL_STANDARDS.phosphorus.low ? 50 : labMeasurements.phosphorus <= SOIL_STANDARDS.phosphorus.high ? 100 : 70);
    }
    if (labMeasurements.potassium !== null) {
      indicatorScores.push(labMeasurements.potassium < SOIL_STANDARDS.potassium.low ? 50 : labMeasurements.potassium <= SOIL_STANDARDS.potassium.high ? 100 : 70);
    }
    if (labMeasurements.organicCarbon !== null) {
      indicatorScores.push(labMeasurements.organicCarbon >= SOIL_STANDARDS.organicCarbon.low ? (labMeasurements.organicCarbon <= SOIL_STANDARDS.organicCarbon.high ? 100 : 85) : 50);
    }

    if (indicatorScores.length) {
      soilHealthStatus.score = Math.round(indicatorScores.reduce((sum, score) => sum + score, 0) / indicatorScores.length);
      soilHealthStatus.availableIndicators = indicatorScores.length;
      soilHealthStatus.overallCondition = soilHealthStatus.score >= 85
        ? 'Excellent - Strong Soil Health'
        : soilHealthStatus.score >= 70
          ? 'Good - Maintain Regular Soil Care'
          : soilHealthStatus.score >= 50
            ? 'Moderate - Needs Targeted Improvement'
            : 'Poor - Immediate Soil Improvement Needed';
    }

    const soilReport = await SoilReport.create({
      user: req.user.id,
      farmLocation: farmLocation || req.user.district,
      sampleLocation: sampleLocation || 'Main Field',
      currentOrPlannedCrop: currentOrPlannedCrop || '',
      season: season || 'Kharif (Monsoon)',
      irrigationAvailable: irrigationAvailable !== undefined ? irrigationAvailable : true,
      knownSoilType: knownSoilType || 'Unknown',
      imageUrl,
      imageAnalysis: {
        visibleColor,
        textureClass,
        moistureAppearance,
        organicMatterVisual,
        possibleSoilType,
        confidence,
        isVisualOnly: !isLabTested,
        visualNotes: file
          ? 'Physical observation highlights surface color and structure. Chemical properties (pH, NPK) require wet-chemistry titration.'
          : 'Report created without image upload.'
      },
      isLabTested,
      labMeasurements,
      soilHealthStatus,
      recommendations,
      organicAmendments
    });

    res.status(201).json({
      success: true,
      message: 'Soil report generated successfully.',
      report: soilReport
    });
  } catch (error) {
    next(error);
  }
};

export const getMySoilReports = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await SoilReport.countDocuments({ user: req.user.id });
    const reports = await SoilReport.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      reports
    });
  } catch (error) {
    next(error);
  }
};

export const getSoilReportById = async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Soil report not found.'
      });
    }

    // Ownership check
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'expert') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this soil report.'
      });
    }

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSoilReport = async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Soil report not found.'
      });
    }

    // Ownership check
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this soil report.'
      });
    }

    await SoilReport.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Soil report deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};


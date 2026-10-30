import { FertilizerRecommendation } from '../models/FertilizerRecommendation.js';
import { SoilReport } from '../models/SoilReport.js';
import { calculateFertilizerPlan } from '../services/fertilizerEngine.js';

export const getFertilizerAdvisory = async (req, res, next) => {
  try {
    const { cropName, landArea, landUnit, soilReportId, customLabValues } = req.body;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required.'
      });
    }

    let labMeasurements = null;

    if (soilReportId) {
      const report = await SoilReport.findById(soilReportId);
      if (report && report.isLabTested) {
        labMeasurements = report.labMeasurements;
      }
    } else if (customLabValues) {
      labMeasurements = customLabValues;
    }

    const advisory = calculateFertilizerPlan({
      cropName,
      landArea: Number(landArea) || 1,
      landUnit: landUnit || 'acres',
      labMeasurements,
      isVisualOnly: !labMeasurements
    });

    const record = await FertilizerRecommendation.create({
      user: req.user.id,
      soilReport: soilReportId || null,
      cropName: advisory.cropName,
      landArea: advisory.landArea,
      landUnit: advisory.landUnit,
      nutrientDeficiencies: advisory.nutrientDeficiencies,
      organicOptions: advisory.organicOptions,
      chemicalOptions: advisory.chemicalOptions,
      integratedNutrientManagementPlan: advisory.integratedNutrientManagementPlan,
      safetyAndStorageGuidelines: advisory.safetyAndStorageGuidelines,
      overApplicationWarnings: advisory.overApplicationWarnings
    });

    res.status(201).json({
      success: true,
      advisory: record
    });
  } catch (error) {
    next(error);
  }
};

export const getMyFertilizerAdvisories = async (req, res, next) => {
  try {
    const advisories = await FertilizerRecommendation.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      advisories
    });
  } catch (error) {
    next(error);
  }
};


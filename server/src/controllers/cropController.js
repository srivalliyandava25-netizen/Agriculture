import { CropRecommendation } from '../models/CropRecommendation.js';
import { recommendCrops, CROP_DATABASE } from '../services/recommendationEngine.js';

const optionalNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const getCropRecommendations = async (req, res, next) => {
  try {
    const {
      state,
      district,
      season,
      soilType,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      climate,
      irrigationType,
      farmSize,
      farmSizeUnit,
      previousCrop,
      farmerPreference,
      saveResult
    } = req.body;

    if (!season) {
      return res.status(400).json({
        success: false,
        message: 'Season is required to generate crop recommendations.'
      });
    }

    const { recommendedCrops, alternativeCrops, cropRotationAdvice } = recommendCrops({
      state: state || req.user.state,
      district: district || req.user.district,
      season,
      soilType: soilType || 'Unknown',
      ph: optionalNumber(ph),
      nitrogen: optionalNumber(nitrogen),
      phosphorus: optionalNumber(phosphorus),
      potassium: optionalNumber(potassium),
      climate: climate || 'Semi-arid',
      irrigationType: irrigationType || 'flood',
      farmSize: farmSize ? Number(farmSize) : 2,
      farmSizeUnit: farmSizeUnit || 'acres',
      previousCrop: previousCrop || '',
      farmerPreference: farmerPreference || ''
    });

    let savedRecord = null;
    if (saveResult || req.body.autoSave) {
      savedRecord = await CropRecommendation.create({
        user: req.user.id,
        inputs: {
          state: state || req.user.state,
          district: district || req.user.district,
          season,
          soilType: soilType || 'Unknown',
          ph: optionalNumber(ph),
          nitrogen: optionalNumber(nitrogen),
          phosphorus: optionalNumber(phosphorus),
          potassium: optionalNumber(potassium),
          climate: climate || 'Semi-arid',
          irrigationType: irrigationType || 'flood',
          farmSize: farmSize ? Number(farmSize) : 2,
          farmSizeUnit: farmSizeUnit || 'acres',
          previousCrop: previousCrop || '',
          farmerPreference: farmerPreference || ''
        },
        recommendedCrops,
        alternativeCrops,
        cropRotationAdvice,
        saved: true
      });
    }

    res.status(200).json({
      success: true,
      recommendations: recommendedCrops,
      alternativeCrops,
      cropRotationAdvice,
      savedRecordId: savedRecord ? savedRecord._id : null
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCropRecommendations = async (req, res, next) => {
  try {
    const records = await CropRecommendation.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      success: true,
      records
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCropRecommendation = async (req, res, next) => {
  try {
    const record = await CropRecommendation.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Recommendation record not found.' });
    }
    if (record.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await CropRecommendation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Record deleted.' });
  } catch (error) {
    next(error);
  }
};

export const getCropCatalog = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      total: CROP_DATABASE.length,
      crops: CROP_DATABASE
    });
  } catch (error) {
    next(error);
  }
};


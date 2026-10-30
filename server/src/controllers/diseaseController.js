import { DiseaseAnalysis } from '../models/DiseaseAnalysis.js';
import { analyzeCropDisease } from '../services/diseaseService.js';
import { getFileUrl } from '../services/storageService.js';

export const detectCropDisease = async (req, res, next) => {
  try {
    const { cropName, symptomsDescription } = req.body;
    const file = req.file;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required.'
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a leaf or fruit image for disease screening.'
      });
    }

    const imageUrl = getFileUrl(file, req);

    const analysis = await analyzeCropDisease({
      cropName,
      imageUrl,
      fileName: file.originalname,
      fileSize: file.size,
      symptomsDescription: symptomsDescription || ''
    });

    const record = await DiseaseAnalysis.create({
      user: req.user.id,
      cropName: analysis.cropName,
      imageUrl: analysis.imageUrl,
      diseaseIdentified: analysis.diseaseIdentified,
      scientificName: analysis.scientificName,
      confidence: analysis.confidence,
      isInconclusive: analysis.isInconclusive,
      symptoms: analysis.symptoms,
      causes: analysis.causes,
      organicCures: analysis.organicCures,
      chemicalControls: analysis.chemicalControls,
      preventiveMeasures: analysis.preventiveMeasures,
      safetyDisclaimer: analysis.safetyDisclaimer
    });

    res.status(201).json({
      success: true,
      analysis: record
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDiseaseAnalyses = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await DiseaseAnalysis.countDocuments({ user: req.user.id });
    const records = await DiseaseAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      records
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDiseaseAnalysis = async (req, res, next) => {
  try {
    const record = await DiseaseAnalysis.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Analysis record not found.' });
    }
    if (record.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await DiseaseAnalysis.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Record deleted.' });
  } catch (error) {
    next(error);
  }
};


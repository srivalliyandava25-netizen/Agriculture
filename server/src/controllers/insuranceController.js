import { DamageIncident } from '../models/DamageIncident.js';
import { getFileUrl } from '../services/storageService.js';

export const reportDamageIncident = async (req, res, next) => {
  try {
    const { cropName, incidentType, incidentDate, affectedAreaAcres, estimatedLossPercent, cropStageAtDamage, notes } = req.body;
    const file = req.file;

    if (!cropName || !incidentType || !incidentDate || affectedAreaAcres === undefined || estimatedLossPercent === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Crop name, incident type, incident date, affected area, and estimated loss % are required.'
      });
    }

    const area = Number(affectedAreaAcres);
    const loss = Number(estimatedLossPercent);
    const damageDate = new Date(incidentDate);
    if (!Number.isFinite(area) || area <= 0 || !Number.isFinite(loss) || loss < 1 || loss > 100 || Number.isNaN(damageDate.getTime()) || damageDate > new Date()) {
      return res.status(400).json({ success: false, message: 'Enter a valid past incident date, positive affected area, and loss percentage from 1 to 100.' });
    }

    const photoUrl = file ? getFileUrl(file, req) : '';

    const incident = await DamageIncident.create({
      user: req.user.id,
      cropName,
      incidentType,
      incidentDate: new Date(incidentDate),
      affectedAreaAcres: area,
      estimatedLossPercent: loss,
      cropStageAtDamage: cropStageAtDamage || 'Vegetative',
      photos: photoUrl ? [photoUrl] : [],
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Crop damage incident logged in private farmer records. Use this record and photos during PMFBY claim survey.',
      incident
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDamageIncidents = async (req, res, next) => {
  try {
    const incidents = await DamageIncident.find({ user: req.user.id }).sort({ incidentDate: -1 });

    res.status(200).json({
      success: true,
      count: incidents.length,
      incidents
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDamageIncident = async (req, res, next) => {
  try {
    const incident = await DamageIncident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }
    if (incident.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    await DamageIncident.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Incident record deleted.' });
  } catch (error) {
    next(error);
  }
};


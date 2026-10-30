import { GovernmentScheme } from '../models/GovernmentScheme.js';

export const getSchemes = async (req, res, next) => {
  try {
    const { category, level, search, state } = req.query;
    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (level && level !== 'all') {
      query.level = level;
    }

    const filters = [];

    if (state) {
      filters.push({
        statesApplicable: { $in: ['All India', new RegExp(state, 'i')] }
      });
    }

    if (search?.trim()) {
      const searchExpression = new RegExp(search.trim(), 'i');
      filters.push({
        $or: [
          { schemeName: searchExpression },
          { purpose: searchExpression },
          { code: searchExpression }
        ]
      });
    }

    if (filters.length) {
      query.$and = filters;
    }

    const schemes = await GovernmentScheme.find(query).sort({ level: 1, schemeName: 1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      schemes
    });
  } catch (error) {
    next(error);
  }
};

export const getSchemeById = async (req, res, next) => {
  try {
    const scheme = await GovernmentScheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }

    res.status(200).json({
      success: true,
      scheme
    });
  } catch (error) {
    next(error);
  }
};


import { EducationalGuide } from '../models/EducationalGuide.js';

export const getGuides = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const guides = await EducationalGuide.find(query).sort({ category: 1, title: 1 });

    res.status(200).json({
      success: true,
      count: guides.length,
      guides
    });
  } catch (error) {
    next(error);
  }
};

export const getGuideBySlug = async (req, res, next) => {
  try {
    const guide = await EducationalGuide.findOne({ slug: req.params.slug });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Educational guide not found.' });
    }

    res.status(200).json({
      success: true,
      guide
    });
  } catch (error) {
    next(error);
  }
};


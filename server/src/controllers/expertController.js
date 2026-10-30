import { ExpertRequest } from '../models/ExpertRequest.js';
import { Notification } from '../models/Notification.js';
import { getFileUrl } from '../services/storageService.js';
import { generateConsultationAdvice, generateFollowUpResponse } from '../services/consultationAIService.js';

export const submitExpertRequest = async (req, res, next) => {
  try {
    const { title, cropName, topic, description, priority, state, district } = req.body;
    const file = req.file;

    if (!title?.trim() || !description?.trim() || !state?.trim() || !district?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, state, and district are required.'
      });
    }

    const imageUrl = file ? getFileUrl(file, req) : '';

    const aiResponse = await generateConsultationAdvice({
      title,
      cropName,
      topic,
      description,
      state: state.trim(),
      district: district.trim(),
      languageCode: req.user.preferredLanguage || 'en'
    });

    const request = await ExpertRequest.create({
      farmer: req.user.id,
      farmerName: req.user.name,
      title,
      cropName: cropName || '',
      topic: topic || 'general',
      description: description.trim(),
      state: state.trim(),
      district: district.trim(),
      imageUrl,
      priority: priority || 'normal',
      status: 'answered',
      aiResponse,
      assignedExpert: undefined
    });

    await Notification.create({
      user: req.user.id,
      type: 'expert_reply',
      title: 'AI Consultation Response Ready',
      message: `Your consultation "${title}" has an immediate AI advisory response. You can also ask follow-up questions.`,
      link: `/ask-expert/${request._id}`
    });

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted to agricultural specialists.',
      request
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await ExpertRequest.find({ farmer: req.user.id })
      .populate('assignedExpert', 'name district state')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

export const getExpertRequests = async (req, res, next) => {
  try {
    const { status, topic } = req.query;
    const query = {};
    if (status) query.status = status;
    if (topic) query.topic = topic;

    const requests = await ExpertRequest.find(query)
      .populate('assignedExpert', 'name district state')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await ExpertRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    // Authorization: Farmer owner, assigned expert, or admin
    if (
      request.farmer.toString() !== req.user.id &&
      req.user.role !== 'expert' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this request.' });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

export const startRequestReview = async (req, res, next) => {
  try {
    const request = await ExpertRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    request.assignedExpert = req.user.id;
    request.status = 'in_review';
    await request.save();

    await Notification.create({
      user: request.farmer,
      type: 'expert_reply',
      title: 'Expert Review Started',
      message: `Agricultural Expert ${req.user.name} is now reviewing your consultation: "${request.title}".`,
      link: `/ask-expert/${request._id}`
    });

    res.status(200).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

export const respondToRequest = async (req, res, next) => {
  try {
    const { diagnosis, recommendation, preventiveActions } = req.body;

    if (!diagnosis || !recommendation) {
      return res.status(400).json({
        success: false,
        message: 'Diagnosis and recommendation are required from the expert.'
      });
    }

    const request = await ExpertRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    request.status = 'answered';
    request.assignedExpert = req.user.id;
    request.expertResponse = {
      diagnosis,
      recommendation,
      preventiveActions: preventiveActions || '',
      answeredAt: new Date(),
      expertName: req.user.name
    };

    await request.save();

    // Trigger notification to the farmer
    await Notification.create({
      user: request.farmer,
      type: 'expert_reply',
      title: 'Expert Response Received',
      message: `Agricultural Expert ${req.user.name} has answered your consultation: "${request.title}".`,
      link: `/ask-expert/${request._id}`
    });

    res.status(200).json({
      success: true,
      message: 'Expert response recorded successfully.',
      request
    });
  } catch (error) {
    next(error);
  }
};

export const addFollowUp = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const request = await ExpertRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    request.followUpMessages.push({
      sender: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: message.trim()
    });

    const aiAnswer = await generateFollowUpResponse({
      request,
      question: message.trim(),
      languageCode: req.user.preferredLanguage || 'en'
    });

    request.followUpMessages.push({
      sender: req.user.id,
      senderName: 'Mitti Mitra AI',
      senderRole: 'ai',
      message: aiAnswer
    });

    await request.save();

    res.status(201).json({
      success: true,
      request
    });
  } catch (error) {
    next(error);
  }
};

export const rateConsultation = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const request = await ExpertRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.farmer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the farmer can rate this consultation.' });
    }

    request.rating = Number(rating);
    request.feedback = feedback || '';
    request.status = 'closed';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Thank you for your rating!',
      request
    });
  } catch (error) {
    next(error);
  }
};


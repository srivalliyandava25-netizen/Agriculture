import {
  User,
  SoilReport,
  CropRecommendation,
  DiseaseAnalysis,
  ExpertRequest,
  CommunityPost,
  AuditLog
} from '../models/index.js';

export const getAdminMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalExperts = await User.countDocuments({ role: 'expert' });
    const totalSoilReports = await SoilReport.countDocuments();
    const totalRecommendations = await CropRecommendation.countDocuments();
    const totalDiseaseAnalyses = await DiseaseAnalysis.countDocuments();
    const totalExpertRequests = await ExpertRequest.countDocuments();
    const pendingExpertRequests = await ExpertRequest.countDocuments({ status: { $in: ['submitted', 'assigned'] } });
    const totalCommunityPosts = await CommunityPost.countDocuments();
    const flaggedPosts = await CommunityPost.countDocuments({ flagged: true });

    // Recent system activity audit
    const recentAuditLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(15);

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalFarmers,
        totalExperts,
        totalSoilReports,
        totalRecommendations,
        totalDiseaseAnalyses,
        totalExpertRequests,
        pendingExpertRequests,
        totalCommunityPosts,
        flaggedPosts
      },
      recentAuditLogs
    });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { state: new RegExp(search, 'i') },
        { district: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleOrStatus = async (req, res, next) => {
  try {
    const { role, active } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (role) {
      if (!['farmer', 'expert', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role.' });
      }
      user.role = role;
    }

    if (active !== undefined) {
      user.active = active;
    }

    await user.save();

    await AuditLog.create({
      user: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'ADMIN_UPDATE_USER',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { updatedRole: role, updatedActive: active }
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const getFlaggedPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find({ flagged: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
};

export const moderatePost = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' or 'remove'
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    if (action === 'approve') {
      post.flagged = false;
      post.flagReason = '';
      await post.save();
      res.status(200).json({ success: true, message: 'Post approved and unflagged.' });
    } else if (action === 'remove') {
      await CommunityPost.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'Post deleted permanently.' });
    } else {
      res.status(400).json({ success: false, message: 'Action must be approve or remove.' });
    }
  } catch (error) {
    next(error);
  }
};


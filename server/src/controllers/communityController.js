import { CommunityPost } from '../models/CommunityPost.js';
import { getFileUrl } from '../services/storageService.js';

export const getPosts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { flagged: false };
    const allowedCategories = ['soil_health', 'crop_selection', 'organic_farming', 'pest_management', 'water_conservation', 'market_info'];

    if (category && category !== 'all') {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid community category.' });
      }
      query.category = category;
    }

    if (search?.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: new RegExp(escapedSearch, 'i') },
        { content: new RegExp(escapedSearch, 'i') }
      ];
    }

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;
    const total = await CommunityPost.countDocuments(query);
    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber) || 1,
      posts
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const file = req.file;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.'
      });
    }
    if (title.trim().length > 200 || content.trim().length > 5000) {
      return res.status(400).json({ success: false, message: 'Post title or content is too long.' });
    }

    const allowedCategories = ['soil_health', 'crop_selection', 'organic_farming', 'pest_management', 'water_conservation', 'market_info'];
    const selectedCategory = category || 'soil_health';
    if (!allowedCategories.includes(selectedCategory)) {
      return res.status(400).json({ success: false, message: 'Invalid community category.' });
    }

    const imageUrl = file ? getFileUrl(file, req) : '';

    const post = await CommunityPost.create({
      author: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      imageUrl
    });

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    post.comments.push({
      user: req.user.id,
      userName: req.user.name,
      text: text.trim()
    });

    await post.save();

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const userIdStr = req.user.id.toString();
    const existingIndex = post.likes.findIndex((id) => id.toString() === userIdStr);

    if (existingIndex > -1) {
      post.likes.splice(existingIndex, 1); // unlike
    } else {
      post.likes.push(req.user.id); // like
    }

    await post.save();

    res.status(200).json({
      success: true,
      likesCount: post.likes.length,
      isLiked: existingIndex === -1
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Ownership check or Admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post.' });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const flagPost = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    post.flagged = true;
    post.flagReason = reason || 'Reported by community user for review';
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post reported for administrator moderation.'
    });
  } catch (error) {
    next(error);
  }
};


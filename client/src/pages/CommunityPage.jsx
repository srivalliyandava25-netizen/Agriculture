import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Send,
  Flag,
  Trash2,
  Search,
  Upload
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { VoiceReader } from '../components/common/VoiceReader.jsx';

export const CommunityPage = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // New post form state
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('organic_farming');
  const [postFile, setPostFile] = useState(null);

  // Active comment input
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/community?category=${category}&search=${encodeURIComponent(search)}`);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('content', postContent);
      formData.append('category', postCategory);
      if (postFile) formData.append('image', postFile);

      await api.post('/community', formData);
      setShowPostForm(false);
      setPostTitle('');
      setPostContent('');
      setPostFile(null);
      setMessage('Post shared with the farmer community successfully.');
      fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      setMessage('Please log in to like community discussions.');
      return;
    }
    try {
      const data = await api.post(`/community/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id === postId) {
            const userId = user?.id;
            const likes = p.likes || [];
            const hasLiked = likes.some((id) => (typeof id === 'object' ? id._id === userId : id === userId));
            const newLikes = hasLiked
              ? likes.filter((id) => (typeof id === 'object' ? id._id !== userId : id !== userId))
              : [...likes, userId];
            return { ...p, likes: newLikes };
          }
          return p;
        })
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddComment = async (postId) => {
    if (!user) {
      setMessage('Please log in to reply to this discussion.');
      return;
    }
    if (!commentText.trim()) return;
    try {
      const data = await api.post(`/community/${postId}/comments`, { text: commentText });
      setPosts((prev) => prev.map((p) => (p._id === postId ? data.post : p)));
      setCommentText('');
      setActiveCommentPostId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete your post?')) return;
    try {
      await api.delete(`/community/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setMessage('Post deleted.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSharePost = async (post) => {
    const url = `${window.location.origin}/community#post-${post._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.content?.slice(0, 160), url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setMessage('Discussion link copied to clipboard.');
      } else {
        window.prompt('Copy this discussion link:', url);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setMessage('Could not share this discussion.');
    }
  };

  const handleFlagPost = async (postId) => {
    try {
      await api.post(`/community/${postId}/flag`, { reason: 'Reported by community user' });
      setMessage('Thank you. The post has been submitted for administrator review.');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Kisan Chaupal Community Forum</span>
            <VoiceReader text="Kisan Chaupal community forum. Share your experiences, ask questions, and learn from progressive farmers across India." />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Farmer Knowledge Exchange
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discuss organic practices, pest alerts, crop prices, and practical field innovations with peers.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              setMessage('Please log in to ask a question or share farming knowledge.');
              return;
            }
            setShowPostForm(!showPostForm);
          }}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800 transition-colors shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ask or Share Knowledge</span>
        </button>
      </div>

      {message && <Alert type="success" message={message} onClose={() => setMessage('')} />}

      {/* New Post Form Drawer */}
      {showPostForm && (
        <form onSubmit={handleCreatePost} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-bold text-base text-slate-900">Start a Discussion in Kisan Chaupal</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="e.g. How I controlled armyworm using neem extract"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topic Category</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="organic_farming">Organic & Natural Farming (जैविक खेती)</option>
                <option value="soil_health">Soil Health & Fertility (मृदा स्वास्थ्य)</option>
                <option value="pest_management">Pest & Disease Control (कीट नियंत्रण)</option>
                <option value="crop_selection">Crop Selection & Seeds (फसल चयन)</option>
                <option value="water_conservation">Water & Irrigation (जल संरक्षण)</option>
                <option value="market_info">Market & Mandi Info (बाजार व भाव)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Photo Attachment (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPostFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Explain your practical observations, dosage used, or specific questions..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowPostForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800"
            >
              Publish Post
            </button>
          </div>
        </form>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {['all', 'crop_selection', 'organic_farming', 'soil_health', 'pest_management', 'water_conservation', 'market_info'].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                category === c
                  ? 'bg-primary-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="w-full sm:w-64 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <p className="text-xs text-slate-500 py-12 text-center">Loading discussions...</p>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No posts in this category yet</h4>
          <p className="text-xs text-slate-500">Be the first progressive farmer to start a conversation.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const isAuthor = user?.id === (typeof post.author === 'object' ? post.author._id : post.author);
            const isLiked = post.likes?.some((id) => (typeof id === 'object' ? id._id === user?.id : id === user?.id));

            return (
              <div key={post._id} id={`post-${post._id}`} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-xs">
                      {post.authorName?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{post.authorName}</span>
                        {post.authorRole === 'expert' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                            Agronomist
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()} &bull;{' '}
                        <span className="capitalize text-primary-700 font-semibold">{post.category.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <VoiceReader text={`${post.title}. ${post.content}`} />
                    <button
                      onClick={() => handleSharePost(post)}
                      className="text-slate-300 hover:text-primary-700 p-1"
                      title="Share this discussion"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {isAuthor ? (
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-slate-300 hover:text-red-500 p-1"
                        title="Delete your post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFlagPost(post._id)}
                        className="text-slate-300 hover:text-amber-600 p-1"
                        title="Report inappropriate content"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80 bg-slate-100">
                    <img src={post.imageUrl} alt="Attached crop" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Likes & Comments Counter */}
                <div className="pt-2 flex items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors ${
                      isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{post.likes?.length || 0} Likes</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
                    className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-primary-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments?.length || 0} Comments</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post._id && (
                  <div className="pt-3 space-y-3 border-t border-slate-100 animate-fadeIn">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a helpful reply..."
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-700 hover:bg-primary-800"
                      >
                        Reply
                      </button>
                    </div>

                    <div className="space-y-2">
                      {post.comments?.map((c, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 text-xs space-y-0.5">
                          <span className="font-bold text-slate-800">{c.userName}</span>
                          <p className="text-slate-600">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


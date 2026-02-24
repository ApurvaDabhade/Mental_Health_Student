import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  Users,
  MessageCircle,
  Heart,
  Handshake,
  Sprout,
  Send,
  ArrowLeft,
  Menu,
  Tag,
  Plus,
  X,
  Loader2
} from 'lucide-react';

const STORAGE_POSTS_KEY = 'peerSupportPosts';
const STORAGE_REPLIES_KEY = 'peerSupportReplies';
const STORAGE_REACTIONS_KEY = 'peerSupportReactions';

export default function PeerSupport() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [replies, setReplies] = useState({});
  const [userReactions, setUserReactions] = useState({});
  
  // Create post form
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Reply form
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  
  // Filter
  const [selectedTag, setSelectedTag] = useState('');

  // Get current user ID from localStorage
  const getUserId = () => {
    return localStorage.getItem('userId');
  };

  const loadPosts = (tag = '') => {
    try {
      setLoading(true);
      const raw = localStorage.getItem(STORAGE_POSTS_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(all) ? all : [];
      const filtered = tag ? list.filter(p => (p.tags || []).includes(tag)) : list;
      setPosts(filtered);

      const reactionsRaw = localStorage.getItem(STORAGE_REACTIONS_KEY);
      const reactionsAll = reactionsRaw ? JSON.parse(reactionsRaw) : {};
      const userId = getUserId();
      setUserReactions((reactionsAll && userId && reactionsAll[userId]) ? reactionsAll[userId] : {});
    } catch (error) {
      console.error('Failed to load local posts:', error);
      setPosts([]);
      setUserReactions({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(selectedTag);
  }, [selectedTag]);

  const fetchReplies = (postId) => {
    try {
      const raw = localStorage.getItem(STORAGE_REPLIES_KEY);
      const all = raw ? JSON.parse(raw) : {};
      const list = all?.[postId] || [];
      setReplies(prev => ({ ...prev, [postId]: list }));
    } catch (error) {
      console.error('Failed to load replies:', error);
      setReplies(prev => ({ ...prev, [postId]: [] }));
    }
  };

  // Create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const userId = getUserId();
    if (!userId) {
      alert('Please log in to create a post');
      return;
    }

    try {
      setSubmitting(true);
      const raw = localStorage.getItem(STORAGE_POSTS_KEY);
      const all = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(all) ? all : [];
      const newPost = {
        _id: `${Date.now()}`,
        content: postContent.trim(),
        tags: postTags,
        userId,
        anonymousId: `Anon-${userId.slice(-4)}`,
        createdAt: new Date().toISOString(),
        replyCount: 0,
        reactionCounts: { support: 0, relate: 0, hope: 0 }
      };
      list.unshift(newPost);
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(list));

      setPostContent('');
      setPostTags([]);
      setShowCreatePost(false);
      loadPosts(selectedTag);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !postTags.includes(tagInput.trim().toLowerCase())) {
      setPostTags([...postTags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tag) => {
    setPostTags(postTags.filter(t => t !== tag));
  };

  // Handle reaction
  const handleReaction = async (postId, reactionType) => {
    const userId = getUserId();
    if (!userId) {
      alert('Please log in to react');
      return;
    }

    try {
      const postsRaw = localStorage.getItem(STORAGE_POSTS_KEY);
      const allPosts = postsRaw ? JSON.parse(postsRaw) : [];
      const postList = Array.isArray(allPosts) ? allPosts : [];

      const reactionsRaw = localStorage.getItem(STORAGE_REACTIONS_KEY);
      const reactionsAll = reactionsRaw ? JSON.parse(reactionsRaw) : {};
      const userMap = reactionsAll[userId] || {};
      const prevReaction = userMap[postId] || null;
      const nextReaction = prevReaction === reactionType ? null : reactionType;
      userMap[postId] = nextReaction;
      reactionsAll[userId] = userMap;
      localStorage.setItem(STORAGE_REACTIONS_KEY, JSON.stringify(reactionsAll));

      const updatedPosts = postList.map(p => {
        if (p._id !== postId) return p;
        const counts = { ...(p.reactionCounts || { support: 0, relate: 0, hope: 0 }) };
        if (prevReaction) counts[prevReaction] = Math.max(0, (counts[prevReaction] || 0) - 1);
        if (nextReaction) counts[nextReaction] = (counts[nextReaction] || 0) + 1;
        return { ...p, reactionCounts: counts };
      });
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(updatedPosts));

      setUserReactions(prev => ({ ...prev, [postId]: nextReaction }));
      setPosts(prev => prev.map(p => p._id === postId ? updatedPosts.find(x => x._id === postId) : p));
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  // Create reply
  const handleCreateReply = async (postId) => {
    if (!replyContent.trim()) return;

    const userId = getUserId();
    if (!userId) {
      alert('Please log in to reply');
      return;
    }

    try {
      setSubmittingReply(true);
      const repliesRaw = localStorage.getItem(STORAGE_REPLIES_KEY);
      const allReplies = repliesRaw ? JSON.parse(repliesRaw) : {};
      const list = allReplies[postId] || [];
      const newReply = {
        _id: `${Date.now()}`,
        content: replyContent.trim(),
        userId,
        anonymousId: `Anon-${userId.slice(-4)}`,
        createdAt: new Date().toISOString()
      };
      list.push(newReply);
      allReplies[postId] = list;
      localStorage.setItem(STORAGE_REPLIES_KEY, JSON.stringify(allReplies));

      setReplyContent('');
      setReplyingTo(null);
      fetchReplies(postId);
      
      // Update reply count
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, replyCount: post.replyCount + 1 }
          : post
      ));

      try {
        const postsRaw = localStorage.getItem(STORAGE_POSTS_KEY);
        const allPosts = postsRaw ? JSON.parse(postsRaw) : [];
        const postList = Array.isArray(allPosts) ? allPosts : [];
        const updated = postList.map(p => p._id === postId ? { ...p, replyCount: (p.replyCount || 0) + 1 } : p);
        localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error('Failed to create reply:', error);
      alert('Failed to create reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Get all unique tags from posts
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  const reactionButtons = [
    { type: 'support', icon: Heart, label: 'Support', emoji: '💙' },
    { type: 'relate', icon: Handshake, label: 'Relate', emoji: '🤝' },
    { type: 'hope', icon: Sprout, label: 'Hope', emoji: '🌱' }
  ];

  return (
    <div className="min-h-screen bg-[#eaf1f5] lg:pl-72">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between" style={{borderColor:'#c8ced1'}}>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-[#f2f7eb] transition-colors"
        >
          <Menu className="w-6 h-6 text-[#2e2f34]" />
        </button>
        <h1 className="text-lg font-bold text-[#2e2f34]">Peer Support</h1>
        <div className="w-10" />
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/mainpage')} 
                className="p-2 rounded-lg hover:bg-white transition-colors" 
                style={{background:'#c8ced1'}}
              >
                <ArrowLeft className="w-5 h-5 text-[#2e2f34]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2e2f34]">Peer Support Community</h1>
                <p className="text-[#767272]">Share experiences and support each other anonymously</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="px-6 py-3 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </button>
          </div>

          {/* Mobile Create Post Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full px-6 py-3 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Post</span>
            </button>
          </div>

          {/* Create Post Modal */}
          {showCreatePost && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{borderColor:'#c8ced1'}}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#2e2f34]">Create Anonymous Post</h2>
                  <button
                    onClick={() => {
                      setShowCreatePost(false);
                      setPostContent('');
                      setPostTags([]);
                    }}
                    className="p-2 hover:bg-[#f2f7eb] rounded-lg"
                  >
                    <X className="w-5 h-5 text-[#2e2f34]" />
                  </button>
                </div>
                
                <form onSubmit={handleCreatePost}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#2e2f34] mb-2">
                      Share your thoughts (anonymous)
                    </label>
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="e.g., Anyone else feeling overwhelmed before placements?"
                      className="w-full p-4 border rounded-xl focus:outline-none focus:border-[#3d9098] focus:ring-2 focus:ring-[#3d9098]/20 resize-none"
                      style={{borderColor:'#c8ced1'}}
                      rows={4}
                      maxLength={1000}
                    />
                    <p className="text-xs text-[#767272] mt-1">{postContent.length}/1000</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#2e2f34] mb-2">
                      Tags (optional)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="e.g., exam stress, lonely, family pressure"
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-[#3d9098]"
                        style={{borderColor:'#c8ced1'}}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-[#3d9098] text-white rounded-lg hover:opacity-90"
                      >
                        Add
                      </button>
                    </div>
                    {postTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {postTags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-[#f2f7eb] text-[#3d9098] rounded-full text-sm flex items-center space-x-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!postContent.trim() || submitting}
                      className="flex-1 px-6 py-3 bg-[#3d9098] text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Post Anonymously</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreatePost(false);
                        setPostContent('');
                        setPostTags([]);
                      }}
                      className="px-6 py-3 border border-[#c8ced1] text-[#2e2f34] rounded-xl font-semibold hover:bg-[#f2f7eb]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedTag
                    ? 'bg-[#3d9098] text-white'
                    : 'bg-white text-[#2e2f34] border'
                }`}
                style={selectedTag ? {borderColor:'#c8ced1'} : {}}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#3d9098] text-white'
                      : 'bg-white text-[#2e2f34] border'
                  }`}
                  style={selectedTag !== tag ? {borderColor:'#c8ced1'} : {}}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Posts List */}
          {loading ? (
            <div className="bg-white border rounded-xl p-12 text-center" style={{borderColor:'#c8ced1'}}>
              <Loader2 className="w-8 h-8 text-[#3d9098] animate-spin mx-auto" />
              <p className="text-[#767272] mt-4">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border rounded-xl p-12 text-center" style={{borderColor:'#c8ced1'}}>
              <Users className="w-12 h-12 text-[#c8ced1] mx-auto mb-4" />
              <p className="text-[#767272]">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post._id} className="bg-white border rounded-xl p-6" style={{borderColor:'#c8ced1'}}>
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#3d9098] rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#2e2f34]">{post.anonymousId}</p>
                        <p className="text-xs text-[#767272]">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-[#2e2f34] mb-4 whitespace-pre-wrap">{post.content}</p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[#f2f7eb] text-[#3d9098] rounded-full text-xs"
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{borderColor:'#c8ced1'}}>
                    {reactionButtons.map(({ type, emoji, label }) => {
                      const isActive = userReactions[post._id] === type;
                      const count = post.reactionCounts?.[type] || 0;
                      return (
                        <button
                          key={type}
                          onClick={() => handleReaction(post._id, type)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-[#3d9098]/20 text-[#3d9098]'
                              : 'bg-[#f2f7eb] text-[#767272] hover:bg-[#3d9098]/10'
                          }`}
                        >
                          <span className="text-lg">{emoji}</span>
                          <span className="text-sm font-medium">{label}</span>
                          {count > 0 && (
                            <span className="text-xs bg-white px-2 py-0.5 rounded-full">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Replies Section */}
                  {selectedPost === post._id ? (
                    <div className="mt-4">
                      {/* Replies List */}
                      {replies[post._id] && replies[post._id].length > 0 && (
                        <div className="space-y-3 mb-4">
                          {replies[post._id].map(reply => (
                            <div key={reply._id} className="bg-[#f2f7eb] rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-[#3d9098] rounded-full flex items-center justify-center">
                                  <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-[#2e2f34]">{reply.anonymousId}</p>
                                <p className="text-xs text-[#767272]">
                                  {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <p className="text-[#2e2f34] text-sm whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      <div className="flex gap-2">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Share encouragement or your experience (no medical advice)..."
                          className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-[#3d9098] resize-none"
                          style={{borderColor:'#c8ced1'}}
                          rows={2}
                          maxLength={500}
                        />
                        <button
                          onClick={() => handleCreateReply(post._id)}
                          disabled={!replyContent.trim() || submittingReply}
                          className="px-6 py-3 bg-[#3d9098] text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {submittingReply ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPost(post._id);
                        fetchReplies(post._id);
                      }}
                      className="text-[#3d9098] text-sm font-medium hover:underline flex items-center space-x-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>View {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


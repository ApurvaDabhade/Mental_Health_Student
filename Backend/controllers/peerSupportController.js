import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import Reaction from '../models/Reaction.js';
import User from '../models/User.js';

// Generate anonymous ID for a user
const generateAnonymousId = (userId) => {
    // Create a consistent anonymous ID based on user ID
    const hash = userId.toString().slice(-6);
    return `Peer #${hash}`;
};

// @desc    Create a new post
// @route   POST /api/peer-support/posts
// @access  Public (no auth for now)
export const createPost = async (req, res) => {
    try {
        const { content, tags, userId } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Post content is required' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const anonymousId = generateAnonymousId(userId);

        const post = await Post.create({
            content: content.trim(),
            tags: tags || [],
            authorId: userId,
            anonymousId
        });

        // Return post without exposing authorId
        const postResponse = {
            _id: post._id,
            content: post.content,
            tags: post.tags,
            anonymousId: post.anonymousId,
            replyCount: post.replyCount,
            reactionCounts: post.reactionCounts,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        };

        res.status(201).json(postResponse);
    } catch (error) {
        console.error('Create Post Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/peer-support/posts
// @access  Public
export const getPosts = async (req, res) => {
    try {
        const { tag, limit = 20, page = 1 } = req.query;
        
        const query = { isActive: true };
        if (tag) {
            query.tags = { $in: [tag.toLowerCase()] };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .select('-authorId'); // Don't expose author ID

        res.status(200).json(posts);
    } catch (error) {
        console.error('Get Posts Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/peer-support/posts/:postId
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .select('-authorId');

        if (!post || !post.isActive) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Get Post Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a reply to a post
// @route   POST /api/peer-support/posts/:postId/replies
// @access  Public
export const createReply = async (req, res) => {
    try {
        const { content, userId, messageType } = req.body;
        const { postId } = req.params;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Reply content is required' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post || !post.isActive) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const anonymousId = generateAnonymousId(userId);

        const reply = await Reply.create({
            postId,
            content: content.trim(),
            authorId: userId,
            anonymousId,
            messageType: messageType || 'custom'
        });

        // Update post reply count
        await Post.findByIdAndUpdate(postId, { $inc: { replyCount: 1 } });

        // Return reply without exposing authorId
        const replyResponse = {
            _id: reply._id,
            content: reply.content,
            anonymousId: reply.anonymousId,
            messageType: reply.messageType,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt
        };

        res.status(201).json(replyResponse);
    } catch (error) {
        console.error('Create Reply Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get replies for a post
// @route   GET /api/peer-support/posts/:postId/replies
// @access  Public
export const getReplies = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post || !post.isActive) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const replies = await Reply.find({ postId, isActive: true })
            .sort({ createdAt: 1 })
            .select('-authorId'); // Don't expose author ID

        res.status(200).json(replies);
    } catch (error) {
        console.error('Get Replies Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add or update reaction to a post
// @route   POST /api/peer-support/posts/:postId/reactions
// @access  Public
export const addReaction = async (req, res) => {
    try {
        const { userId, reactionType } = req.body;
        const { postId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!['support', 'relate', 'hope'].includes(reactionType)) {
            return res.status(400).json({ message: 'Invalid reaction type' });
        }

        // Verify post exists
        const post = await Post.findById(postId);
        if (!post || !post.isActive) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already has a reaction
        const existingReaction = await Reaction.findOne({ postId, userId });

        if (existingReaction) {
            // If same reaction type, remove it (toggle off)
            if (existingReaction.reactionType === reactionType) {
                await Reaction.deleteOne({ _id: existingReaction._id });
                // Decrement count
                await Post.findByIdAndUpdate(postId, {
                    $inc: { [`reactionCounts.${reactionType}`]: -1 }
                });
                return res.status(200).json({ 
                    message: 'Reaction removed',
                    reactionType: null,
                    reactionCounts: {
                        ...post.reactionCounts.toObject(),
                        [reactionType]: post.reactionCounts[reactionType] - 1
                    }
                });
            } else {
                // Update to new reaction type
                const oldType = existingReaction.reactionType;
                existingReaction.reactionType = reactionType;
                await existingReaction.save();
                
                // Update counts
                await Post.findByIdAndUpdate(postId, {
                    $inc: { 
                        [`reactionCounts.${oldType}`]: -1,
                        [`reactionCounts.${reactionType}`]: 1
                    }
                });
            }
        } else {
            // Create new reaction
            await Reaction.create({ postId, userId, reactionType });
            // Increment count
            await Post.findByIdAndUpdate(postId, {
                $inc: { [`reactionCounts.${reactionType}`]: 1 }
            });
        }

        // Get updated post with reaction counts
        const updatedPost = await Post.findById(postId);
        const userReaction = await Reaction.findOne({ postId, userId });

        res.status(200).json({
            message: 'Reaction updated',
            reactionType: userReaction ? userReaction.reactionType : null,
            reactionCounts: updatedPost.reactionCounts
        });
    } catch (error) {
        console.error('Add Reaction Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user's reaction for a post
// @route   GET /api/peer-support/posts/:postId/reactions
// @access  Public
export const getUserReaction = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const reaction = await Reaction.findOne({ postId, userId });

        res.status(200).json({
            reactionType: reaction ? reaction.reactionType : null
        });
    } catch (error) {
        console.error('Get User Reaction Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


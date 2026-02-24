import User from '../models/User.js';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
    const { firebaseUid, email, fullName, role = 'user' } = req.body;

    if (!firebaseUid || !email || !fullName) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { firebaseUid }] });

        if (userExists) {
            if (userExists.firebaseUid === firebaseUid) {
                // User already exists, return successful 200 (idempotent behavior for frontend reruns)
                return res.status(200).json(userExists);
            }
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create user
        const user = await User.create({
            firebaseUid,
            email,
            fullName,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register User Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user by Firebase UID
// @route   GET /api/users/firebase/:uid
// @access  Public (or Private)
// @desc    Get user by Firebase UID
// @route   GET /api/users/firebase/:uid
// @access  Public (or Private)
export const getUserByFirebaseUid = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });

        if (user) {
            res.json({
                _id: user._id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

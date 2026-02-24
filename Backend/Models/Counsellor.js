import mongoose from 'mongoose';

const counsellorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specializations: [{
        type: String, // e.g., "Anxiety", "Depression", "Career Counseling"
        trim: true
    }],
    bio: {
        type: String,
        maxLength: 500
    },
    qualifications: [{
        degree: String,
        institution: String,
        year: Number
    }],
    licenseNumber: { // Optional, depending on verification needs
        type: String,
        select: false // potentially sensitive, exclude by default
    },
    experienceYears: {
        type: Number,
        min: 0
    },
    languages: [{
        type: String // e.g., "English", "Hindi"
    }],
    availability: {
        // Simple availability structure
        days: [{
            type: String, // 'Mon', 'Tue', etc.
            enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }],
        slots: [{
            startTime: String, // "09:00"
            endTime: String    // "17:00"
        }]
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

const Counsellor = mongoose.model('Counsellor', counsellorSchema);

export default Counsellor;

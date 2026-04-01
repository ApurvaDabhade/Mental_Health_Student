import mongoose from "mongoose";

/** Full onboarding + lifestyle + mental + behavioral inputs for Manas Veda */
const wellnessProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, trim: true, lowercase: true },

    fullName: String,
    age: Number,
    gender: String,
    heightCm: Number,
    weightKg: Number,
    department: String,
    yearOfStudy: String,
    emergencyContact: String,
    healthConditions: String,
    medications: String,

    sleepHours: Number,
    waterIntakeLiters: Number,
    screenTimeHours: Number,
    studyHours: Number,
    exerciseFrequency: String,
    dailySteps: Number,
    outdoorActivityMins: Number,
    socialMediaHours: Number,
    nightDeviceUsage: String,

    moodRating: { type: Number, min: 1, max: 10 },
    stressLevel: { type: Number, min: 1, max: 10 },
    anxietyLevel: { type: Number, min: 1, max: 10 },
    burnoutLevel: { type: Number, min: 1, max: 10 },
    socialInteractionLevel: { type: Number, min: 1, max: 10 },
    sleepQuality: { type: Number, min: 1, max: 10 },
    motivationLevel: { type: Number, min: 1, max: 10 },
    academicPressureLevel: { type: Number, min: 1, max: 10 },

    phoneUnlocksPerDay: Number,
    nightPhoneUsage: String,
    walkingSteps: Number,
    outdoorActivityTime: Number,
    timeSpentAloneHours: Number,
    socialMediaUsage: Number,
    studyProductivityScore: { type: Number, min: 1, max: 10 },

    onboardingComplete: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("WellnessProfile", wellnessProfileSchema);

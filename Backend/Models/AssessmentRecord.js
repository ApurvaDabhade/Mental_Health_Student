import mongoose from "mongoose";

const assessmentRecordSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    module: {
      type: String,
      required: true,
      enum: [
        "PHQ9",
        "GAD7",
        "PSS",
        "BURNOUT",
        "SLEEP",
        "SOCIAL",
        "ACADEMIC",
        "LIFESTYLE",
      ],
    },
    totalScore: Number,
    maxScore: Number,
    severity: String,
    answers: [mongoose.Schema.Types.Mixed],
    context: String,
  },
  { timestamps: true }
);

export default mongoose.model("AssessmentRecord", assessmentRecordSchema);

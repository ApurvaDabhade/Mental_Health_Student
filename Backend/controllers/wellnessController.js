import WellnessProfile from "../Models/WellnessProfile.js";
import AssessmentRecord from "../Models/AssessmentRecord.js";
import { buildStressReportPayload } from "../services/wellnessReportService.js";

export const upsertWellnessProfile = async (req, res) => {
  try {
    const body = req.body || {};
    const userId = body.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    body.onboardingComplete = true;
    body.updatedAt = new Date();
    const doc = await WellnessProfile.findOneAndUpdate(
      { userId },
      { $set: body },
      { upsert: true, new: true, runValidators: false }
    );
    return res.status(200).json(doc);
  } catch (e) {
    console.error("upsertWellnessProfile", e);
    return res.status(500).json({ message: e.message });
  }
};

export const getWellnessProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const doc = await WellnessProfile.findOne({ userId });
    return res.status(200).json(doc || null);
  } catch (e) {
    console.error("getWellnessProfile", e);
    return res.status(500).json({ message: e.message });
  }
};

export const saveAssessmentRecord = async (req, res) => {
  try {
    const { userId, module, totalScore, maxScore, severity, answers, context } = req.body;
    if (!userId || !module) {
      return res.status(400).json({ message: "userId and module required" });
    }
    const rec = await AssessmentRecord.create({
      userId,
      module,
      totalScore,
      maxScore,
      severity,
      answers: answers || [],
      context: context || "",
    });
    return res.status(201).json(rec);
  } catch (e) {
    console.error("saveAssessmentRecord", e);
    return res.status(500).json({ message: e.message });
  }
};

export const listAssessments = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await AssessmentRecord.find({ userId }).sort({ createdAt: -1 }).limit(100).lean();
    return res.status(200).json(list);
  } catch (e) {
    console.error("listAssessments", e);
    return res.status(500).json({ message: e.message });
  }
};

export const getStressReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await WellnessProfile.findOne({ userId });
    const assessments = await AssessmentRecord.find({ userId }).sort({ createdAt: -1 }).limit(50);
    const payload = buildStressReportPayload(profile, assessments);
    return res.status(200).json(payload);
  } catch (e) {
    console.error("getStressReport", e);
    return res.status(500).json({ message: e.message });
  }
};

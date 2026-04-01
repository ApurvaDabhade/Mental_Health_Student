import express from "express";
import {
  upsertWellnessProfile,
  getWellnessProfile,
  saveAssessmentRecord,
  listAssessments,
  getStressReport,
} from "../controllers/wellnessController.js";

const router = express.Router();

router.post("/profile", upsertWellnessProfile);
router.get("/profile/:userId", getWellnessProfile);
router.post("/assessment", saveAssessmentRecord);
router.get("/assessments/:userId", listAssessments);
router.get("/report/:userId", getStressReport);

export default router;

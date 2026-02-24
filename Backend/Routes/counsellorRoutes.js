import express from "express";
import {
  createCounsellorProfile,
  getCounsellorByUserId,
  getAllCounsellors
} from "../controllers/counsellorController.js";

const router = express.Router();

// Create or update counsellor profile
router.post("/", createCounsellorProfile);

// Get counsellor by user ID
router.get("/:userId", getCounsellorByUserId);

// Get all counsellors
router.get("/", getAllCounsellors);

export default router;

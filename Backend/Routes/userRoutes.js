import express from 'express';
const router = express.Router();

// ❌ fix import path by adding .js
import { registerUser, getUserByFirebaseUid } from '../controllers/userController.js';

router.post('/', registerUser);
router.get('/firebase/:uid', getUserByFirebaseUid);

export default router;

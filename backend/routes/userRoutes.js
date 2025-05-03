// these routes are related to user

import express from 'express';
import { registerUser, authUser, allUsers } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers); // Register a new user
router.post('/login', authUser); // Login a user

export default router;
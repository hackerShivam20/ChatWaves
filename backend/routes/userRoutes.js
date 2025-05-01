// these routes are related to user

import express from 'express';
import { registerUser, authUser } from '../controllers/userControllers.js';

const router = express.Router();

router.route('/').post(registerUser); // Register a new user
router.post('/login', authUser); // Login a user

export default router;
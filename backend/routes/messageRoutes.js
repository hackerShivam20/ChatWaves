import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Import the authentication middleware
import { allMessages, sendMessage } from '../controllers/messageControllers.js';

const router = express.Router();

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

export default router;
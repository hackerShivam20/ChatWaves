import express from "express"
import { protect } from "../middleware/authMiddleware.js"; // Import the authentication middleware
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chatControllers.js";

const router = express.Router();

// used for access chats only by logged in user
// fetching one on one chat
router.route("/").post(protect, accessChat);

// for fetching chats of logged in user
// this route is used to fetch all chats of the logged in user
// fetching all chats of user
router.route("/").get(protect, fetchChats); // Fetch chats for logged in user

// for creating group chat
router.route("/group").post(protect, createGroupChat);

// for renaming group or updating group name
router.route("/rename").put(protect, renameGroup);

// for adding user to group chat
router.route("/groupadd").put(protect, addToGroup);

// for removing user from group chat
router.route("/groupremove").put(protect, removeFromGroup);

export default router;
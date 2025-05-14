import asyncHandler from "express-async-handler";
import { Message } from "../models/messageModel.js"; // Import the Message model
import { Chat } from "../models/chatModels.js";
import { User } from "../models/userModel.js";

const sendMessage = asyncHandler(async (req, res) => {
    //  things required for sending message
    // 1. chatId (from body)
    // 2. sender of the message (from middleware protect)
    // 3. actual message itself (from body)

    const { chatId, content } = req.body; // Destructure chatId and content from the request body

    if (!chatId || !content) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400); // Bad Request
    }

    // new message
    var newMessage = {
        sender: req.user._id, // Get the sender's ID from the authenticated user
        content: content, // The message content
        chat: chatId, // The chat ID 
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic"); // Populate the sender field with name and pic
        message = await message.populate("chat"); // Populate the chat field with chat details
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email", // Populate the users in the chat with name, pic, and email
        });

        // find by id and update the chat with the latest message
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message, // Update the chat with the latest message
        });

        res.json(message); // Send the message as a response
    } catch (error) {
       res.status(400);
        throw new Error(error.message); // Handle any errors that occur during message creation
    }
});

const allMessages = asyncHandler(async (req, res) => {
    // get all messages of a particular chat
    const { chatId } = req.params; // Get the chatId from the request parameters

    try {
        // in below line we use params because it used as parameter in route
        const messages = await Message.find({ chat: req.params.chatId }) // Find all messages for the given chatId
            .populate("sender", "name pic email") // Populate the sender field with name, pic, and email
            .populate("chat"); // Populate the chat field with chat details

        res.json(messages); // Send the messages as a response
    } catch (error) {
        res.status(400);
        throw new Error(error.message); // Handle any errors that occur during message retrieval
    }
});

export { sendMessage, allMessages };
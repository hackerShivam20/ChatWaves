// use for all operations related to chats

import asyncHandler from "express-async-handler"; // Import asyncHandler for handling asynchronous requests
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModels.js"; // Import the Chat model
// import { Message } from "../models/messageModel"; // Import the Message model


// for creating and fetching one on one chats
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body; // Extract userId from the request body

    if (!userId) {
        console.log("UserId param not sent with request"); // Log an error message if userId is not provided
        return res.sendStatus(400); // Send a 400 Bad Request response
    }

    // check if chat exists or not
    var isChat = await Chat.find({
        isGroup: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, // Check if the user is part of the chat
            { users: { $elemMatch: { $eq: userId } } }, // Check if the other user is part of the chat
        ],
    }).populate("users", "-password").populate("latestMessage"); // Populate user details and latest message

    // contains all final data of chat
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if(isChat.length > 0) {
        res.send(isChat[0]); // If chat exists, send the existing chat
    } else {
        // if chat not exists , then create a new chat
        var chatData = {
            chatName: "sender",
            isGroup: false,
            users: [req.user._id, userId], //req.user._id is the logged-in user and userId is the other user whose we wnat to chat with
        };

        // queryit and store in database
        try {
            const createdChat = await Chat.create(chatData); // Create a new chat
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password"); // Populate user details
            res.status(200).json(fullChat); // Send the newly created chat
        } catch (error) {
            res.status(400); // Set response status to 400 (Bad Request)
            throw new Error(error.message); // Throw an error if chat creation fails
            return;
        }
    }
});

// for fetching all chats of logged in user
const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) // Find chats where the logged-in user is a participant
            .populate("users", "-password") // Populate user details excluding password
            .populate("groupAdmin", "-password") // populate or show groupAdmin if group Chat
            .populate("latestMessage") // Populate latest message details
            .sort({ updatedAt: -1 }) // Sort chats by the most recent update
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).json(results);
            });
    } catch (error) {
        res.status(400); // Set response status to 400 (Bad Request)
        throw new Error(error.message);
    }
}); // Function to fetch all chats of the logged-in user

// for creating group chats
// here we want bunch of users or group of users or array of users and chat name
const createGroupChat = asyncHandler(async (req, res) => {

    // if all fields are not filled
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please fill all the fields!"});
    }

    // take all users from body in array in stringify format(frontend) nad parse(backend)
    var users = JSON.parse(req.body.users);

    // check that group have atleast two users or more
    if(users.length < 2){
        return res.status(400)
        .send("More than 2 users are required to create a group chat");
    }

    // iska matlab jo user login hai wo bhi hoga baki users ke sath group me isliye all users wale array me currently logged in user ko bhi add kar diya hai
    users.push(req.user);

    // queries
    try {
        // create new chat in group
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        // fetch this group chat from our database and send it to back to user
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// this is for rename the group name
const renameGroup = asyncHandler(async (req, res) => {
    const { groupChatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        groupChatId,
        {
            chatName,
        },{
            new: true, // it will be used because both name is same as chatName
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found!");
    } else{
        res.json(updatedChat);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { groupChatId, userId } = req.body; // Extract groupChatId and userId from the request body

    const added =await Chat.findByIdAndUpdate(
        groupChatId,
        {
            $push: { users: userId },
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else{
        res.json(added);  // for sending the data
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { groupChatId, userId } = req.body; // Extract groupChatId and userId from the request body

    const removed = await Chat.findByIdAndUpdate(
        groupChatId,
        {
            $pull: { users: userId },
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    }
    else{
        res.json(removed);  // for sending the data
    }
});

export { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }; // Export the accessChat function for use in other files
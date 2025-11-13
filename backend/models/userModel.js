import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
        },
        pic: {
            type: String,
            default:
                "https://static-00.iconduck.com/assets.00/profile-major-icon-1024x1024-9rtgyx30.png",
        },
    },
    {
        timestamps: true,
    }
);

// matchpassword function for login user
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare the entered password with the hashed password
};

// userSchema.pre("save", async function (next) {

//     pre("save") is a Mongoose middleware (hook).
    
//     It runs automatically before saving a document (e.g., user registration).
    
//     It gives you a chance to modify data (like hashing the password) before it's stored in MongoDB.
    
//     if (!this.isModified("password")) { next(); }
    
//     This checks if the password field has been changed or created.
    
//     If password is unchanged, skip hashing to avoid double-hashing an already hashed password.
    
//     next() continues to the actual .save() process.

// save karne se pehle password ko hash form me karke then databsae me save karenge jisse security bani rahe
// encrption of password before saving to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next(); // If the password is not modified, proceed to the next middleware
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
});

export const User = mongoose.model("User", userSchema);

// import mongoose from "mongoose";
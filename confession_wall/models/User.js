import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    avatar: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.User || mongoose.model('User', userSchema)

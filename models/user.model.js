import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    role: {
        type: String,
        enum: ["author", "reader"]
    },
    blogIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User;
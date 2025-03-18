import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    content: {
        type: String,
        required: [true, "content is required"]
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "authorId is required"]
    }
}, { timestamps: true })

const Blog = mongoose.model("blog", blogSchema)

export default Blog;
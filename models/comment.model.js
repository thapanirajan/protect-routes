
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blogs"
    },
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }
}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
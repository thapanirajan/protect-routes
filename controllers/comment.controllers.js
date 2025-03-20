import mongoose from "mongoose";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";


export const handleCreateNewComment = async (req, res) => {
    try {

        const blogId = req.params.id;
        console.log(blogId)
        const blog = await Blog.findById(blogId)

        if (!blog) {
            return res.status(400).json({ msg: "Blog not found" })
        }
        const { text } = req.body;
        const newComment = new Comment({ text, blogId: blogId, authorId: req.user.id })
        await newComment.save()

        await Blog.updateOne(
            { _id: blogId },
            { $addToSet: { comments: newComment._id } }
        )
        return res.status(201).json({
            msg: "Comment created successfully",
            comment: newComment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error creating comment",
            error: error.message
        });
    }
}


export const handleGetCommentsByBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        
        // validate blogId
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ msg: "Invalid blgo ID" })
        }
        
        
        // must convert blogId into object id before entering data for $match because in model blogId is store as ObjectId -->  blogId:{
        // type:mongoose.Schema.Types.ObjectId,
        const objectIdBlogId = new mongoose.Types.ObjectId(blogId);

        // aggregate pipeline
        const comments = await Comment.aggregate([
            // match comment by blogId
            { $match: { blogId: objectIdBlogId } },

            // $lookup to join with User collectyion to extract username and email of user 
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "authorDetails"
                }
            },

            // $unwind convert elements of array into each seperate document
            { $unwind: "$authorDetails" },

            // $project select which field to show and which field not to show for comment we only need comment and author details and author email.
            {
                $project: {
                    text: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "authorDetails.username": 1,
                    "authorDetails.email": 1
                }
            },
            // sort by creation date (descending order) --> -1 means highest to lowest and 1 means lowest to highest 
            // in case of date -1 --> newest date to oldest date and 1 --> oldest date to newest date
            { $sort: { createdAt: -1 } }
        ])

        if (!comments || comments.length === 0) {
            return res.status(200).json({
                msg: "No comments found for this blog",
                data: [],
            });
        }
        res.status(200).json({
            msg: "Comments retrieved successfully",
            data: comments,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error fetching comments",
            error: error.message,
        });
    }
}


export const handleDeleteComment = async (req, res) => {
    res.send("comment deleted")
}
// -> to delete comment the user must be logged in must be owner of comment or owner of the blog 

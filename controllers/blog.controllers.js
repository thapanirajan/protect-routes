import Blog from "../models/blog.model.js"
import User from "../models/user.model.js";


export const handleViewAllBlogs = async (req, res) => {
    const blogs = await Blog.find().populate('authorId')
    console.log(blogs);
    res.status(200).json({ data: blogs })
}

export const handleCreateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        console.log("req", req.user)
        const user = req.user

        if (!(title || content)) {
            return res.status(400).json({
                success: false,
                message: "All the fields are required"
            })
        }

        const newBlog = new Blog({ title, content, authorId: req.user.id })
        await newBlog.save()

        if (!newBlog) {
            return res.status(400).json({ msg: "new Blog not created" })
        }

        console.log("New blog created:", newBlog);
        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { $push: { blogIds: newBlog._id } },
            { new: true }
        );

        console.log("Updated user:", updatedUser);

        if (!updatedUser) {
            console.log("User not found or not updated");
        }


        res.status(200).json({
            success: true,
            new_blog: newBlog
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const handleUpdateBlog = async (req, res) => {
    const { title, content } = req.body;
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { title, content, updatedAt: Date.now() },
        { new: true }
    )
    res.status(200).json({ updatedBlog: blog })
}

export const handleDeleteBlog = async (req, res) => {
    const id = req.params.id;
    const deleteBlog = await Blog.findByIdAndDelete(id)
    
    await User.findByIdAndUpdate(deleteBlog.authorId, {
        $pull: {
            blogIds: id
        }
    })

    res.json({ deleteBlog })
}

export const handleGetBlogsByAuthor = async (req, res) => {
    const authorId = req.params.userId;
    const blogs = await Blog.find({ authorId })
        .select('title content createdAt updatedAt')
        .sort({ createdAt: -1 }) // sort by ascending order based on creation date

    if (!blogs || blogs.length === 0) {
        return res.status(200).json({
            message: 'No blogs found for this author',
            data: [],
        });
    }

    res.status(200).json({
        message: 'Blogs retrieved successfully',
        data: blogs,
    });
}
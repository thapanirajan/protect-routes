
import jwt from "jsonwebtoken"
import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1]; // Expecting <<Bearer Token>>

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Authentication failed: NO token provided",
                    error: "Missing token"
                })
            }
            req.user = decoded
            next()
        });
    } catch (error) {
        console.error('Error in authenticateToken:', error);
        res.status(500).json({
            message: 'Internal server error during authentication',
            error: error.message,
        });
    }
}

export const isAuthor = (req, res, next) => {
    try {
        console.log("is author",req.user.role)

        if (req.user.role != "author") {
            return res.status(400).json({
                message: 'Access denied: Requires author role',
                details: `User role '${req.user.role}' is not authorized`,
            });
        }
        next()
    } catch (error) {
        console.error('Error in isAuthor:', error);
        res.status(500).json({
            message: 'Internal server error during role check',
            error: error.message,
        });
    }
}

export const ownsBlog = async (req, res, next) => {
    try {

        const blogId = req.params.id;


        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                message: 'Invalid blog ID format',
                error: 'Bad request',
            });
        }


        const blog = await Blog.findById(id)

        if (!blog) {
            return res.status(400).json({
                message: "Blog not found"
            })
        }

        if (!req.user || !req.user.id) {
            return res.status(400).json({
                message: "No user data",
                error: "Missing user info"
            })
        }

        if (blog.authorId.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied: You can only update you own blog',
                detail: `User ${req.user.username} doesnot own ${blogId}`
            });
        }

        req.blog = blog

        next();

    } catch (error) {
        console.log("Error in ownsBlog middleware", error.message)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}


export const notFoundMiddleware = (req, res, next) => {
    res.status(404).send("<div>Page Not Found</div>")
}
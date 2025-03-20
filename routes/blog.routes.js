
import { Router } from "express";
import { handleCreateBlog, handleDeleteBlog, handleGetBlogsByAuthor, handleUpdateBlog, handleViewAllBlogs } from "../controllers/blog.controllers.js";
import { authenticateToken, isAuthor, ownsBlog } from "../middlewares/middleware.js";


const blogRoutes = Router()

// view all blogs

blogRoutes.get("/", handleViewAllBlogs)
blogRoutes.post("/", authenticateToken, isAuthor, handleCreateBlog)
blogRoutes.put("/:id", authenticateToken, isAuthor, ownsBlog, handleUpdateBlog)
blogRoutes.delete("/:id", authenticateToken, isAuthor, ownsBlog, handleDeleteBlog)
blogRoutes.get("/:userId", handleGetBlogsByAuthor)


export default blogRoutes;
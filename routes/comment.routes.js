
import { Router } from "express";
import { handleCreateNewComment, handleGetCommentsByBlog } from "../controllers/comment.controllers.js";
import { authenticateToken } from "../middlewares/middleware.js";

const commentRoutes = Router({ mergeParams: true })

commentRoutes.post("/", authenticateToken, handleCreateNewComment)
commentRoutes.get("/", handleGetCommentsByBlog)

export default commentRoutes;
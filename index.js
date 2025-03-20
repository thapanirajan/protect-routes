import express from "express"


import { config } from "dotenv"
import connectDB from "./database/db.js"
import authRoutes from "./routes/auth.routes.js"
import blogRoutes from "./routes/blog.routes.js"
import { notFoundMiddleware } from "./middlewares/middleware.js"
import commentRoutes from "./routes/comment.routes.js"
config()

const app = express()

app.use(express.json())

// routes level middleware 
app.use("/api/auth", authRoutes)
app.use("/api/blog", blogRoutes)
app.use("/api/blog/:id/comment", commentRoutes)

// 404-page not found middleware
app.use(notFoundMiddleware)

const port = process.env.PORT || 3000

app.listen(port, async () => {
    await connectDB()
    console.log(`Server running on http://localhost:${port}`);
});

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"
import connectDB from "./db/db.js"
import authRoutes from "./routes/auth.routes.js"
import musicRoutes from "./routes/music.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import userRoutes from "./routes/user.routes.js"
import ErrorHandler from "./utils/error.js"


const app = express()

connectDB()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/music", musicRoutes)
app.use("/api/playlist", playlistRoutes)
app.use("/api/user", userRoutes)


// server.js Global Error Handler
app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // 1. Mongoose Bad ObjectId (CastError)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ErrorHandler(message, 400);
    }

    // 2. Mongoose Duplicate Key Error (code 11000)
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message, 400);
    }

    // 3. Wrong JWT Error
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try again.";
        error = new ErrorHandler(message, 400);
    }

    // Final delivery to the user
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        stack: err.stack
        // stack: process.env.NODE_ENV === "development" ? err.stack : null
    });
});


app.listen(3000, () => {
    console.log("server is running on 3000");
})
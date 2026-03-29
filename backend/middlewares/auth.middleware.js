import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/error.js";

export const protect = async (req, res, next) => {
    try {
        let token = req.cookies.token

        if (!token) return next(new ErrorHandler("Login required", 401))

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id).select("-password")
        next()

    } catch (err) {
        res.status(401).json({ message: "Token Not Found" })
    }
}

export const artistOnly = (req, res, next) => {
    if (req.user && req.user.role === "artist") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Artists only." })
    }
}
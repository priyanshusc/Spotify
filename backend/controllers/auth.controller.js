import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import ErrorHandler from "../utils/error.js"

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })
        if (existingUser) {
            // 👇 if not use "error.js"
            // const error = new Error("User already registered");
            // error.statusCode = 400;
            // return next(error);

            // 👇 if use "error.js"
            return next(new ErrorHandler("User already registered", 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (err) {
        next(err)
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        const user = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (!user) {
            return next(new ErrorHandler("Username or password is incorrect", 400));
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorHandler("Username or password is incorrect", 400));
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,                // Prevents JavaScript from accessing the cookie (XSS protection)
            secure: process.env.NODE_ENV === "production", // Only sends over HTTPS in production
            sameSite: "strict",            // Prevents CSRF (Cross-Site Request Forgery)
            maxAge: 24 * 60 * 60 * 1000,   // Expires in 1 day (matching the JWT)
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        next(err)
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        next(err);
    }
};
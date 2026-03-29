// this is the centralized file to handle all the backend errors happen in this project

class ErrorHandler extends Error {
    constructor(message, statusCode) {
        // 1. Send the message to the built-in Error class
        super(message);

        // 2. Attach our custom status code
        this.statusCode = statusCode;

        // 3. Track exactly which line of code caused the crash
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;


// CONCEPT 👇

// ✅extends Error
// "Copy everything that the built-in JavaScript Error can do, so I don't have to write it from scratch."

// ✅constructor(...)
// "When I type new ErrorHandler(...), expect me to hand you two things: a text message and a number."

// ✅super(message)
// super calls the parent. It says: "Hey built-in Error class, here is the message. Do your normal thing with it."

// ✅this.statusCode
// "Take the number I handed you and tape it to this specific instance of the error."

// ✅captureStackTrace
// "Remember the exact file and line number where this error was created so it's easy to fix later."




// if i dont use error.js file concept and write menually

export const getUserProfile = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id).populate("musics").select("-password")
// this code👇 
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
// this code👆
        res.status(200).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }
}

// and if i follow error.js constructor concept then i will have to write only 1 line

export const getUserProfilee = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id).populate("musics").select("-password")
// this code👇 
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
// this code👆
        res.status(200).json({ success: true, data: user })

    } catch (err) {
        next(err)
    }
}

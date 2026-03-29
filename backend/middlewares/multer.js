import multer from "multer";
import path from "path";
import ErrorHandler from "../utils/error.js";

// 1. Storage Configuration (Temporary local storage before Cloudinary)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Make sure this folder exists!
    },
    filename: (req, file, cb) => {
        // Creates a unique name: timestamp-originalname
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// 2. The File Filter (The "ID Check")
const fileFilter = (req, file, cb) => {
    const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jfif", "image/jpg"];

    if (file.fieldname === "audio") {
        if (allowedAudioTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ErrorHandler("Invalid audio format. Only MP3/WAV allowed.", 400), false);
        }
    } else if (file.fieldname === "thumbnail") {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new ErrorHandler("Invalid image format. Only JPG/PNG/WEBP allowed.", 400), false);
        }
    } else {
        cb(new ErrorHandler("Unknown file field", 400), false);
    }
};

// 3. Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit per file
    }
});

export default upload;
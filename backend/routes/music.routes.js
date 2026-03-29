import express from "express"
import upload from "../middlewares/multer.js";
import { protect, artistOnly } from "../middlewares/auth.middleware.js"
import { createMusic, deleteMusic, getAllMusic, searchMusic, toggleLike } from "../controllers/music.controller.js"

const router = express.Router()

const uploadFields = upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
])
router.get("/all", getAllMusic)
router.post("/upload", protect, artistOnly, uploadFields, createMusic)
router.delete("/delete/:id", protect, artistOnly, deleteMusic)
router.get("/search", searchMusic)
router.post("/togglelike/:id", protect, toggleLike)

export default router
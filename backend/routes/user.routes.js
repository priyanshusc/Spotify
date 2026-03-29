import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { followArtist, unfollowArtist, getUserProfile, getArtistPublicProfile, getLikedSongs } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/follow/:id", protect, followArtist)
router.post("/unfollow/:id", protect, unfollowArtist)
router.get("/profile", protect, getUserProfile)
router.get("/artist/profile/:id", getArtistPublicProfile)
router.get("/liked-songs", protect, getLikedSongs)

export default router

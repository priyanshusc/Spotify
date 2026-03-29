import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { createPlaylist, addMusicToPlaylist, getPlaylist, removeMusicFromPlaylist, getAllPlaylists, deletePlaylist, editPlaylist } from "../controllers/playlist.controller.js"

const router = express.Router()

router.post("/create", protect, createPlaylist)
router.get("/my-playlists", protect, getAllPlaylists);
router.get("/:playlistId", protect, getPlaylist)
router.delete("/:playlistId", protect, deletePlaylist);
router.post("/add-song/:playlistId", protect, addMusicToPlaylist)
router.patch("/remove-song/:playlistId", protect, removeMusicFromPlaylist);
router.put("/edit/:playlistId", protect, editPlaylist);

export default router
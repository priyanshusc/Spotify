// i have implemented new concept 👉"next(err)" -> Global Error Handling (or Centralized Error Handling). for this see 👉"error.js" and i implemented this concept in 👉auth.controller.js

// but i havent implemented that concept in here just to analyse how old way looks(👉music.controller.js) and how new way looks (👉auth.controller.js)


import fs from "fs"
import cloudinary from "../config/cloudinary.js";
import Music from "../models/music.model.js"
import User from "../models/user.model.js"

export const createMusic = async (req, res) => {
    try {
        const { title } = req.body

        if (!req.files || !req.files.audio || !req.files.thumbnail) {
            return res.status(400).json({ success: false, message: "No file provided" })
        }

        const audioFile = req.files.audio[0];
        const thumbnailFile = req.files.thumbnail[0];

        // Upload Audio
        const audioResult = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video",
            folder: "spotify_songs"   // folder in cloudinary
        });

        // Upload thumbnail
        const imageResult = await cloudinary.uploader.upload(thumbnailFile.path, {
            resource_type: "image",
            folder: "spotify_songs"   // folder in cloudinary
        });

        const newMusic = await Music.create({
            title,
            uri: audioResult.secure_url,
            public_id: audioResult.public_id,
            thumbnail_uri: imageResult.secure_url,
            thumbnail_public_id: imageResult.public_id,
            artist: req.user.id
        })

        await User.findByIdAndUpdate(req.user.id, {
            $push: { musics: newMusic._id }
        })

        fs.unlinkSync(audioFile.path);
        fs.unlinkSync(thumbnailFile.path);

        res.status(201).json({
            success: true,
            message: "Song added",
            data: newMusic
        })

    } catch (err) {
        // 1. Check if req.files exists
        if (req.files) {
            // 2. Get all keys (audio, thumbnail, etc.)
            Object.keys(req.files).forEach((key) => {
                // 3. Loop through the array for each key
                req.files[key].forEach((file) => {
                    // 4. If the file exists on your disk, kill it
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            });
        }

        // 5. Finally, send the error to your "Garage" or send it directly
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getAllMusic = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const skip = (page - 1) * limit

        const allMusics = await Music.find()
            .populate("artist", "username")
            .sort("-createdAt")
            .skip(skip)
            .limit(limit)

        const totalSongs = await Music.countDocuments()

        res.status(200).json({
            success: true,
            data: allMusics,
            count: allMusics.length,
            currentPage: page,
            totalSongs,
            totalPages: Math.ceil(totalSongs / limit),
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const deleteMusic = async (req, res) => {
    try {
        const songId = req.params.id
        const artistId = req.user.id

        const song = await Music.findById(songId)

        if (!song) {
            return res.status(404).json({ success: false, message: "Song not found" })
        }

        if (song.artist.toString() !== artistId) {
            return res.status(403).json({ success: false, message: "Not Authorized" })
        }

        await Music.findByIdAndDelete(songId)

        await Promise.all([
            User.findByIdAndUpdate(artistId, { $pull: { musics: songId } }),
            cloudinary.uploader.destroy(song.public_id, { resource_type: "video" }),
            cloudinary.uploader.destroy(song.thumbnail_public_id, { resource_type: "image" }),
            User.updateMany(
                { likedSongs: songId },
                { $pull: { likedSongs: songId } }
            )
        ]);

        res.status(200).json({ success: true, message: "Song deleted from cloud and database" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const searchMusic = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Please provide a query" });
        }

        const artistsFound = await User.find({
            username: { $regex: query, $options: "i" },
            role: "artist"
        }).select("username profilePicture");

        const artistIds = artistsFound.map(artist => artist._id);

        const songsFound = await Music.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { artist: { $in: artistIds } }
            ]
        }).populate("artist", "username profilePicture");

        res.status(200).json({
            success: true,
            data: {
                artists: artistsFound,
                songs: songsFound
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const toggleLike = async (req, res) => {
    try {
        const songId = req.params.id;
        const userId = req.user.id; // Make sure this is 'id' and not '_id' based on your middleware

        const song = await Music.findById(songId);
        if (!song) return res.status(404).json({ success: false, message: "Song not found" });

        // Check if already liked (converts to string for safe comparison)
        const isLiked = song.likes.map(id => id.toString()).includes(userId);

        if (isLiked) {
            // --- UNLIKE LOGIC ---
            await Promise.all([
                User.findByIdAndUpdate(userId, { $pull: { likedSongs: songId } }),
                Music.findByIdAndUpdate(songId, { $pull: { likes: userId } })
            ]);
        } else {
            // --- LIKE LOGIC ---
            await User.findByIdAndUpdate(userId, { $addToSet: { likedSongs: songId } });
            await Music.findByIdAndUpdate(songId, { $addToSet: { likes: userId } });
        }

        res.status(200).json({
            success: true,
            isLiked: !isLiked,
            message: `Song ${!isLiked ? "liked" : "unliked"}`
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const getLikedSongs = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("likedSongs", "title artist thumbnail_uri");
        res.status(200).json({ success: true, data: user.likedSongs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
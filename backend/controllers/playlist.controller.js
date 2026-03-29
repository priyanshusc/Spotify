import Music from "../models/music.model.js"
import Playlist from "../models/playlist.model.js"
import ErrorHandler from "../utils/error.js"

export const createPlaylist = async (req, res, next) => {
    try {
        const { name, description, thumbnail } = req.body

        if (!name || !description) {
            return next(new ErrorHandler(`${!name ? "Name" : "Description"} is required`, 400))
        }

        const newPlaylist = await Playlist.create({
            name,
            description,
            thumbnail: thumbnail || undefined,
            musics: [],
            owner: req.user.id
        })

        res.status(201).json({
            success: true,
            message: "Playlist created",
            data: newPlaylist
        })

    } catch (err) {
        next(err)
    }
}

export const getPlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params

        const playlist = await Playlist.findById(playlistId).populate({    // This is the way to populate When we have three arguments
            path: "musics",
            select: "title uri thumbnail_uri artist",
            populate: {
                path: "artist",
                select: "username"
            }
        })

        if (!playlist) return next(new ErrorHandler("Playlist not found", 404))

        res.status(200).json({ success: true, data: playlist })
    } catch (err) {
        next(err)
    }
}

export const getAllPlaylists = async (req, res, next) => {
    try {
        const userId = req.user.id

        const playlists = await Playlist.find({ owner: userId })
            .select("name description thumbnail musics")
            .sort("-createdAt");

        if (playlists.length === 0) return res.status(200).json({
            success: true,
            message: "No Playlist found",
            data: []
        })

        res.status(200).json({
            success: true,
            data: playlists,
            count: playlists.length
        })

    } catch (err) {
        next(err)
    }
}

export const deletePlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params
        const userId = req.user.id

        const playlist = await Playlist.findById(playlistId)

        if (!playlist) return next(new ErrorHandler("Playlist not found", 404))

        if (playlist.owner.toString() !== userId) return next(new ErrorHandler("You don't own this playlist", 403))

        await playlist.deleteOne()

        res.status(200).json({ success: true, message: "Playlist deleted" })

    } catch (err) {
        next(err)
    }
}

export const addMusicToPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.playlistId
        const { songId } = req.body
        const userId = req.user.id

        if (!songId) return next(new ErrorHandler("Please provide a song ID", 400))

        const playlist = await Playlist.findById(playlistId)

        if (!playlist) return next(new ErrorHandler("Playlist not found", 404))

        if (playlist.owner.toString() !== userId) return next(new ErrorHandler("You don't own this playlist", 403));

        const song = await Music.findById(songId)
        if (!song) return next(new ErrorHandler("Song not found", 404));

        await Playlist.findByIdAndUpdate(playlistId, {
            $addToSet: { musics: songId }
        })

        res.status(200).json({
            success: true,
            message: "Song added to playlist"
        });

    } catch (err) {
        next(err)
    }
}

export const removeMusicFromPlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params
        const { songId } = req.body

        if (!songId) return next(new ErrorHandler("Please provide song Id", 400))

        const playlist = await Playlist.findById(playlistId)

        if (!playlist) return next(new ErrorHandler("Playlist not found", 404))

        if (playlist.owner.toString() !== req.user.id) return next(new ErrorHandler("You dont own this playlist", 403))

        await Playlist.findByIdAndUpdate(playlistId, {
            $pull: { musics: songId }
        })

        res.status(200).json({
            success: true,
            message: "Song removed"
        })
    } catch (err) {
        next(err)
    }
}

export const editPlaylist = async (req, res, next) => {
    try {
        const { playlistId } = req.params
        const { name, description, thumbnail } = req.body
        const userId = req.user.id

        const playlist = await Playlist.findById(playlistId)

        if (!playlist) return next(new ErrorHandler("Playlist not found", 404))

        if (playlist.owner.toString() !== userId) return next(new ErrorHandler("You don't own this playlist", 403))

        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
            name,
            description,
            thumbnail
        }, { new: true })

        res.status(200).json({
            success: true,
            message: "Playlist updated",
            data: updatedPlaylist
        })
    } catch (err) {
        next(err)
    }
}
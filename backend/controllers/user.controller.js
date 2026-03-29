import User from "../models/user.model.js"
import ErrorHandler from "../utils/error.js"

export const getUserProfile = async (req, res, next) => {
    try {

        const user = await User.findById(req.user.id).populate("musics profilePicture").select("-password")

        if (!user) {
            // 👇 if not use "error.js"
            // const error = new Error("User not found");
            // error.statusCode = 404;
            // return next(error);

            // 👇 if use "error.js"
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (err) {
        next(err)
    }
}

export const getArtistPublicProfile = async (req, res, next) => {
    try {
        const id = req.params.id

        const artist = await User.findById(id).populate("musics").select("username musics role profilePicture")

        if (!artist || artist.role !== "artist") {
            return next(new ErrorHandler("Artist not found", 404))
        }

        res.status(200).json({ success: true, data: artist })
    } catch (err) {
        // res.status(500).json({ success: false, message: "Invalid Artist ID" });

        //👇 if we use centralized server.js error handling middleware then write this
        next(err)
    }
}

export const followArtist = async (req, res, next) => {
    try {
        const artistId = req.params.id
        const userId = req.user.id

        if (userId === artistId) return next(new ErrorHandler("Cant follow yourself", 400))

        const artist = await User.findById(artistId)

        if (!artist) return next(new ErrorHandler("Artist not found", 404))

        if (artist.role !== "artist") return next(new ErrorHandler("This user is not an artist", 400))

        await User.findByIdAndUpdate(userId, {
            $addToSet: { following: artistId }
        })

        await User.findByIdAndUpdate(artistId, {
            $addToSet: { followers: userId }
        })

        res.status(200).json({ success: true, message: `You are following ${artist.username}` })
    } catch (err) {
        next(err)
    }
}

export const unfollowArtist = async (req, res, next) => {
    try {
        const artistId = req.params.id
        const userId = req.user.id

        if (userId === artistId) return next(new ErrorHandler("Cant unfollow yourself", 400))

        const artist = await User.findById(artistId)

        if (!artist) return next(new ErrorHandler("Artist not found", 404))

        if (artist.role !== "artist") return next(new ErrorHandler("This user is not an artist", 400))

        await User.findByIdAndUpdate(userId, {
            $pull: { following: artistId }
        })

        await User.findByIdAndUpdate(artistId, {
            $pull: { followers: userId }
        })

        res.status(200).json({ success: true, message: `Unfollowed ${artist.username}` })
    } catch (err) {
        next(err)
    }
}

export const getLikedSongs = async (req, res, next) => {
    try {
        const userId = req.user.id

        const user = await User.findById(userId).populate({
            path: "likedSongs",
            select: "uri thumbnail_uri title artist",
            populate: {
                path: "artist",
                select: "username profilePicture"
            }
        })

        if (!user) return next(new ErrorHandler("User not found", 404))

        res.status(200).json({
            success: true,
            count: user.likedSongs.length,
            data: user.likedSongs
        });

    } catch (err) {
        next(err);
    }
}
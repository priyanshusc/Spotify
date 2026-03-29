import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a playlist name"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    musics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "music"
        }
    ],
    // We'll keep the thumbnail simple for now (optional)
    thumbnail: {
        type: String,
    }
}, { timestamps: true });

const Playlist = mongoose.model("playlist", playlistSchema);

export default Playlist;
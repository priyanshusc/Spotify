import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
    {
        uri: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        thumbnail_uri: {
            type: String,
            required: true
        },
        thumbnail_public_id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }]
    },
    {
        timestamps: true,
    }
);

const Music = mongoose.model("music", musicSchema);

export default Music;
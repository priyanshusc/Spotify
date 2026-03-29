import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "artist"],
            default: "user",
        },
        profilePicture: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        },
        musics: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "music"
            }
        ],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }],
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }],
        likedSongs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "music"
        }]
    },
    {
        timestamps: true,
    }
);

userSchema.index({ likedSongs: 1 });

const User = mongoose.model("user", userSchema);

export default User;
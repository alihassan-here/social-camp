import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64,
    },
    secret: {
        type: String,
        required: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    about: {},
    image: {
        url: String,
        public_id: String
    },
    role: {
        type: String,
        default: "Subscriber",
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
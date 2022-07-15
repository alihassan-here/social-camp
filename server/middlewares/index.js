import { expressjwt } from "express-jwt";
import Post from "../models/post";
import User from "../models/user";

export const requireSignIn = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
});

export const canEditDeletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params._id);
        if (req.auth._id !== post.postedBy.toString()) {
            return res.status(400).send("Unauthorized");
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id);
        if (user.role !== 'Admin') {
            return res.status(400).send("unauthorized");
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
    }
}
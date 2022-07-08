import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import { generateFromEmail, generateUsername } from "unique-username-generator";


export const register = async (req, res) => {
    const { name, email, password, secret } = req.body;
    if (!name) return res.json({
        error: "Name is required",
    })
    if (!password || password.length < 6) return res.json({
        error: "Password is required and must be at least 6 characters long"
    });
    if (!secret) return res.json({
        error: "Answer is required",
    });

    const exist = await User.findOne({ email });
    if (exist) return res.json({
        error: "Email is already taken",
    });

    //HASH PASSWORD
    const hashedPassword = await hashPassword(password);

    //GENEREAE RANDOM USERNAME
    const username = generateFromEmail(
        email,
        3
    );

    const user = new User({
        name,
        email,
        password: hashedPassword,
        secret,
        username,
    });

    try {
        await user.save();
        return res.status(201).json({
            ok: true
        })
    } catch (error) {
        console.log("Register Failed =>", error.message);
        return res.json({
            error: error.message.split(":")[2]
        });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //CHECK IF OUR DB HAS USER WITH EMAIL
        const user = await User.findOne({ email });
        if (!user) return res.json({
            error: "No user found!"
        });
        //CHECK PASSWORD
        const match = await comparePassword(password, user.password);
        if (!match) return res.json({
            error: "Invalid email or password!"
        });
        //CREATE SIGNED JWT TOKEN
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        //MAKE SURE WE DON'T SEND PASSWORD AND SECRET
        user.password = undefined;
        user.secret = undefined;

        res.status(200).json({
            token,
            user,
        })
    } catch (error) {
        console.log(error);
        return res.json({
            error: "Error. Try again"
        })
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.json({
            error: "Error. Try again"
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword, secret } = req.body;
        if (!newPassword || !newPassword < 6) {
            return res.json({
                error: "New password is required and should be 6 characters long!"
            });
        }
        if (!secret) {
            return res.json({
                error: "Secret is required!"
            });
        }
        const user = await User.findOne({ email, secret });
        if (!user) {
            return res.json({
                error: "we can't verify you with those details!"
            });
        }

        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, { password: hashed });
        return res.json({
            Success: "Congrats! Now you can login with your new password"
        });

    } catch (error) {
        console.log(error);
        res.json({
            error: "Something went wrong, Try again"
        });
    }
}

export const profileUpdate = async (req, res) => {
    try {
        const { name, password, secret, about, image } = req.body;
        const data = {};
        if (name) {
            data.name = name;
        }
        if (password) {
            if (password.length < 6) {
                return res.json({ error: "Password is required and must be at least 6 characters long" });
            } else {
                data.password = await hashPassword(password);
            }
        }
        if (secret) {
            data.secret = secret;
        }
        if (about) {
            data.about = about;
        }
        if (image) {
            data.image = image;
        }

        let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });

        user.password = undefined;
        user.secret = undefined;

        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const findPeople = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        //first get all following of user
        let following = user.following;
        //put yourself  into this array
        following.push(user._id);
        //find all people for suggestion except those who you are following
        const people = await User.find(
            { _id: { $nin: following } }
        )
            .select("-password -secret")
            .limit(10);
        res.json(people);
    } catch (error) {
        console.log(error);
    }
}

//middleware
export const addFollower = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $addToSet: { followers: req.auth._id },
        });
        next();
    } catch (error) {
        console.log(error);
    }
}

export const userFollow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.auth._id,
            {
                $addToSet: { following: req.body._id },
            },
            { new: true }
        ).select("-password -secret");
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const userFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        const following = await User.find({ _id: user.following })
            .limit(100);
        res.json(following);
    } catch (error) {
        console.log(error);
    }
}

//MIDDLEWARE
export const removeFollower = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.body._id, {
            $pull: { followers: req.auth._id },
        });
        next();
    } catch (error) {
        console.log(error);
    }
}

export const userUnfollow = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.auth._id, {
            $pull: { following: req.body._id }
        }, {
            new: true
        });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const searchUser = async (req, res) => {
    const { query } = req.params;
    if (!query) return;
    try {
        const user = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } }
            ]
        }).select("-password -secret");
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password -secret");
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}
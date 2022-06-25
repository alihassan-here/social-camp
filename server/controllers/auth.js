import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password, secret } = req.body;
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) return res.status(400).send("Password is required and must be at least 6 characters long");
    if (!secret) return res.status(400).send("Answer is required");

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).send("Email is already taken");

    //HASH PASSWORD
    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword, secret });

    try {
        await user.save();
        return res.status(201).json({
            ok: true
        })
    } catch (error) {
        console.log("Register Failed =>", error);
        return res.status(400).send("Error. Try again !");
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //CHECK IF OUR DB HAS USER WITH EMAIL
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("No user found!");
        //CHECK PASSWORD
        const match = await comparePassword(password, user.password);
        if (!match) return res.status(400).send("Invalid email or password!");
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
        return res.status(400).send("Error. Try again")
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id);
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(400).send("Error. Try again")
    }
}
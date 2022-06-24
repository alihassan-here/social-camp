import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";

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
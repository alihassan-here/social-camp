import Post from "../models/post";
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const createPost = async (req, res) => {
    const { content, image } = req.body;
    if (!content.length) {
        return res.json({
            error: "Content is required!"
        })
    }

    try {
        const post = new Post({ content, image, postedBy: req.auth._id });
        await post.save();
        res.json(post);

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

export const uploadImage = async (req, res) => {
    try {
        let result = await cloudinary.uploader.upload(req.files.image.path);
        res.json({
            url: result.secure_url,
            public_id: result.public_id
        })
    } catch (error) {
        console.log(error);
    }
}

export const postsByUser = async (req, res) => {
    try {
        // const posts = await Post.find({ postedBy: req.auth._id })
        const posts = await Post.find({})
            .populate("postedBy", "_id name photo")
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(posts);
    } catch (error) {
        console.log(error);
    }
}

export const userPost = async (req, res) => {
    try {
        const { _id } = req.params;
        const post = await Post.findById(_id);
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}

export const updatePost = async (req, res) => {
    try {
        const { _id } = req.params;
        const post = await Post.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        res.json(post);
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const { _id } = req.params;
        const post = await Post.findByIdAndDelete(_id);
        //remove image from cloudinary
        if (post.image && post.image.public_id) {
            const image = await cloudinary.uploader.destroy(post.image.public_id);
        }
        res.json({ ok: true });
    } catch (error) {
        console.log(error);
    }
}
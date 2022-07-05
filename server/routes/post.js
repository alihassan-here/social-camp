import express from 'express';
import formidable from "express-formidable";
const router = express.Router();

//IMPORT CONTROLLERS
import {
    createPost,
    uploadImage,
    postsByUser,
    userPost,
    updatePost,
    deletePost,
    newsFeed,
} from "../controllers/post";
import { requireSignIn, canEditDeletePost } from '../middlewares';

router.post("/create-post"
    , requireSignIn
    , createPost
);
router.post(
    "/upload-image",
    requireSignIn,
    formidable({ maxFileSize: 5 * 1024 * 1024 }),
    uploadImage
);

//GET ALL POSTS
router.get("/user-posts", requireSignIn, postsByUser);
//GET SINGLE POST
router.get("/user-post/:_id", requireSignIn, userPost);

//UPDATE POST
router.put("/update-post/:_id", requireSignIn, canEditDeletePost, updatePost);

//DELETE POST
router.delete("/delete-post/:_id", requireSignIn, canEditDeletePost, deletePost);

//GET POSTS FOR NEWS FEED
router.get("/news-feed", requireSignIn, newsFeed);


module.exports = router;
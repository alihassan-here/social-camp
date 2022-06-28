import express from 'express';
const router = express.Router();

//IMPORT CONTROLLERS
import { createPost } from "../controllers/post";
import { requireSignIn } from '../middlewares';

router.post("/create-post", requireSignIn, createPost);


module.exports = router;
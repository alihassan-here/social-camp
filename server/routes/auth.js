import express from 'express';
const router = express.Router();

//IMPORT CONTROLLERS
import {
    register,
    login,
    currentUser,
    forgotPassword,
    profileUpdate,
    findPeople,
    addFollower,
    userFollow,
    userFollowing,
    userUnfollow,
    removeFollower
} from "../controllers/auth";
import { requireSignIn } from '../middlewares';

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignIn, currentUser);
router.post("/forgot-password", forgotPassword);
router.put("/profile-update", requireSignIn, profileUpdate);
router.get("/find-people", requireSignIn, findPeople);
router.put("/user-follow", requireSignIn, addFollower, userFollow);
router.put("/user-unfollow", requireSignIn, removeFollower, userUnfollow);
router.get("/user-following", requireSignIn, userFollowing);

module.exports = router;
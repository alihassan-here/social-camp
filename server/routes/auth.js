import express from 'express';
const router = express.Router();

//IMPORT CONTROLLERS
import {
    register,
    login,
    currentUser,
    forgotPassword,
} from "../controllers/auth";
import { requireSignIn } from '../middlewares';

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignIn, currentUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
import { Router } from "express";
const router = Router();

// Include Methods
import {
    loginUser,
    signupUser,
    updateUser,
    updatePassword,
    removeUser,
    getUserInfo,
    getUserStats,
    getNotifications,
} from "../controllers/usersController";

// REST API Endpoints
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.patch("/user", updateUser);
router.patch("/password", updatePassword);
router.delete("/user", removeUser);

router.get("/user", getUserInfo);
router.get("/stats", getUserStats);
router.get("/notifications", getNotifications);

export default router;

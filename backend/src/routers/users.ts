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
router.patch("/user/:id", updateUser);
router.patch("/password/:id", updatePassword);
router.delete("/user/:id", removeUser);

router.get("/user/:id", getUserInfo);
router.get("/stats/:id", getUserStats);
router.get("/notifications/:id", getNotifications);

export default router;

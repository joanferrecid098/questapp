import { Router } from "express";
const router = Router();

// Include Methods
import {
    loginUser,
    signupUser,
    updateUser,
    removeUser,
    getGroups,
} from "../controllers/usersController";

// REST API Endpoints
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", removeUser);

router.get("/groups/:id", getGroups);

export default router;

import { Router } from "express";
const router = Router();

// Include Methods
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    removeUser,
    getGroups,
} from "../controllers/usersController";

// REST API Endpoints
router.get("/", getUsers);
router.get("/user/:id", getUser);
router.post("/", createUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", removeUser);

router.get("/groups/:id", getGroups);

export default router;

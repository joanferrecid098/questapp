import { Router } from "express";
const router = Router();

// Include Methods
import {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    removeGroup,
    getUsers,
    addUser,
    removeUser,
    getQuestion,
} from "../controllers/groupsController";

// REST API Endpoints
router.get("/", getGroups);
router.get("/group/:id", getGroup);
router.post("/", createGroup);
router.patch("/group/:id", updateGroup);
router.delete("/group/:id", removeGroup);

router.get("/users", getUsers);
router.post("/users", addUser);
router.delete("/users/:id", removeUser);

router.get("/question", getQuestion);

export default router;

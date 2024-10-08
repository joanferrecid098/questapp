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
    removeUser,
    getQuestion,
    joinGroup,
    createInvite,
} from "../controllers/groupsController";

// REST API Endpoints
router.get("/", getGroups);
router.get("/group/:id", getGroup);
router.post("/", createGroup);
router.patch("/group/:id", updateGroup);
router.delete("/group/:id", removeGroup);

router.get("/users/:id", getUsers);
router.delete("/users", removeUser);
router.post("/invite", createInvite);
router.post("/invite/:uuid", joinGroup);

router.get("/question/:id", getQuestion);

export default router;

import { Router } from "express";
const router = Router();

// Include Methods
import {
    getVotes,
    submitVote,
    updateVote,
    removeVote,
} from "../controllers/votesController";

// REST API Endpoints
router.get("/vote/:qid", getVotes);
router.post("/", submitVote);
router.patch("/vote/:id", updateVote);
router.delete("/vote/:id", removeVote);

export default router;

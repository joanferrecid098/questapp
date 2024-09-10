import { Request, Response } from "express";

// Vote Details
export const getVotes = (req: Request, res: Response) => {
    res.send("Get votes for a question (:qid)");
};

export const submitVote = (req: Request, res: Response) => {
    res.send("Submit a vote");
};

export const updateVote = (req: Request, res: Response) => {
    res.send("Update a vote");
};

export const removeVote = (req: Request, res: Response) => {
    res.send("Delete a vote");
};

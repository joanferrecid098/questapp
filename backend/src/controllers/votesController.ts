import { Request, Response } from "express";
import db from "../connection";

// Vote Details
export const getVotes = async (req: Request, res: Response) => {
    const { qid } = req.params;

    const query = "SELECT * FROM votes WHERE question_id = ?";

    await db
        .query(query, [qid])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const submitVote = async (req: Request, res: Response) => {
    const { from_id, to_id, question_id } = req.body;

    const query = "INSERT INTO votes VALUES (NULL, ?, ?, ?)";

    await db
        .query(query, [from_id, to_id, question_id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const updateVote = async (req: Request, res: Response) => {
    const { from_id, to_id, question_id } = req.body;
    const { id } = req.params;

    const query =
        "UPDATE votes SET from_id = ?, to_id = ?, question_id = ? WHERE id = ?";

    await db
        .query(query, [from_id, to_id, question_id, id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const removeVote = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = "DELETE FROM votes WHERE id = ?";

    await db
        .query(query, [id])
        .then((result) => {
            res.status(200).json(result[0]);
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

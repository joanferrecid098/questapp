import { Request, Response } from "express";
import db from "../connection";
import { RowDataPacket } from "mysql2";

// Vote Details
export const getVotes = async (req: Request, res: Response) => {
    const { qid } = req.params;

    if (!qid) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query =
        "SELECT id, from_id, to_id, question_id FROM votes WHERE question_id = ?";

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
    const { to_id, group_id } = req.body;

    if (!req.user.id || !to_id || !group_id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const questionQuery =
        "SELECT id FROM questions WHERE group_id = ? AND date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";

    const insertQuery = "INSERT INTO votes VALUES (NULL, ?, ?, ?)";

    const question = await db
        .query<RowDataPacket[]>(questionQuery, [group_id, group_id])
        .catch((err) => {
            res.status(400).json({ error: err });
        });

    if (!question) {
        res.status(400).json({
            error: "There was an error while getting the question.",
        });
        return;
    }

    let question_id: number;

    try {
        question_id = question[0][0].id;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }

    await db
        .query(insertQuery, [req.user.id, to_id, question_id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const updateVote = async (req: Request, res: Response) => {
    const { to_id, question_id } = req.body;
    const { id } = req.params;

    if (!req.user.id || !to_id || !question_id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query =
        "UPDATE votes SET from_id = ?, to_id = ?, question_id = ? WHERE id = ?";

    await db
        .query(query, [req.user.id, to_id, question_id, id])
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

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

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

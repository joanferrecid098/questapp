import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import db from "../connection";
import {
    GroupRow,
    MembershipRow,
    QuestionRow,
    VoteRow,
} from "../interfaces/models";

// Vote Details
export const getVotes = async (req: Request, res: Response) => {
    const { qid } = req.params;

    if (!qid) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    try {
        const groupQuery =
            "SELECT groups.id FROM questions INNER JOIN groups ON questions.group_id = groups.id WHERE questions.id = ?";
        const [group] = await db.query<GroupRow[]>(groupQuery, [qid]);

        if (!group) {
            res.status(400).json({
                error: "There was an error while getting the votes.",
            });
            return;
        }

        if (group.length < 1) {
            res.status(404).json({ error: "Question not found." });
            return;
        }

        const joinedQuery =
            "SELECT id FROM memberships WHERE group_id = ? AND user_id = ?";
        const [joined] = await db.query<MembershipRow[]>(joinedQuery, [
            group[0].id,
            req.user.id,
        ]);

        if (!joined) {
            res.status(400).json({
                error: "There was an error while getting the votes.",
            });
            return;
        }

        if (joined.length < 1) {
            res.status(404).json({ error: "Question not found." });
            return;
        }

        const votesQuery =
            "SELECT id, from_id, to_id, question_id FROM votes WHERE question_id = ?";
        const [votes] = await db.query<VoteRow[]>(votesQuery, [qid]);

        res.status(200).json(votes);
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }
};

export const submitVote = async (req: Request, res: Response) => {
    const { to_id, group_id } = req.body;

    if (!req.user.id || !to_id || !group_id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    try {
        const joinedQuery =
            "SELECT id FROM memberships WHERE group_id = ? AND user_id = ?";
        const [joined] = await db.query<MembershipRow[]>(joinedQuery, [
            group_id,
            req.user.id,
        ]);

        if (!joined) {
            res.status(400).json({
                error: "There was an error while getting the votes.",
            });
            return;
        }

        if (joined.length < 1) {
            res.status(404).json({ error: "Group not found." });
            return;
        }

        const questionQuery =
            "SELECT id FROM questions WHERE group_id = ? AND date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";
        const [question] = await db.query<QuestionRow[]>(questionQuery, [
            group_id,
            group_id,
        ]);

        if (!question) {
            res.status(400).json({
                error: "There was an error while submitting the vote.",
            });
            return;
        }

        const insertQuery = "INSERT INTO votes VALUES (NULL, ?, ?, ?)";
        const [insert] = await db.query<ResultSetHeader>(insertQuery, [
            req.user.id,
            to_id,
            question[0].id,
        ]);

        res.status(200).json(insert);
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }
};

export const updateVote = async (req: Request, res: Response) => {
    const { to_id } = req.body;
    const { id } = req.params;

    if (!req.user.id || !to_id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    try {
        const questionQuery =
            "SELECT id FROM questions WHERE group_id = ? AND date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";
        const [question] = await db.query<QuestionRow[]>(questionQuery, [
            id,
            id,
        ]);

        if (!question) {
            res.status(400).json({
                error: "There was an error while updating the vote.",
            });
            return;
        }

        if (question.length < 1) {
            res.status(404).json({ error: "Vote not found." });
            return;
        }

        const updateQuery =
            "UPDATE votes SET to_id = ? WHERE from_id = ? AND question_id = ?";
        const [update] = await db.query<ResultSetHeader>(updateQuery, [
            to_id,
            req.user.id,
            question[0].id,
        ]);

        res.status(200).json(update);
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }
};

export const removeVote = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    try {
        const questionQuery =
            "SELECT id FROM questions WHERE group_id = ? AND date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";
        const [question] = await db.query<QuestionRow[]>(questionQuery, [
            id,
            id,
        ]);

        if (!question) {
            res.status(400).json({
                error: "There was an error while updating the vote.",
            });
            return;
        }

        if (question.length < 1) {
            res.status(404).json({ error: "Vote not found." });
            return;
        }

        const voteQuery =
            "DELETE FROM votes WHERE from_id = ? AND question_id = ?";
        const [vote] = await db.query<ResultSetHeader>(voteQuery, [
            req.user.id,
            question[0].id,
        ]);

        res.status(200).json(vote);
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }
};

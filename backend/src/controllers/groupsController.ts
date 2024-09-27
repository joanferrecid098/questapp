import { Request, Response } from "express";
import db from "../connection";
import { UserRow, VoteRow } from "../interfaces/models";

// Group Details
export const getGroups = async (req: Request, res: Response) => {
    await db
        .query("SELECT * FROM groups")
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const getGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query =
        "SELECT * FROM groups INNER JOIN questions ON groups.id = questions.group_id WHERE groups.id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";

    await db
        .query(query, [id, id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const createGroup = async (req: Request, res: Response) => {
    const { name, owner } = req.body;

    const query = "INSERT INTO groups VALUES (NULL, ?, ?)";

    await db
        .query(query, [name, owner])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const updateGroup = async (req: Request, res: Response) => {
    const { name, owner } = req.body;
    const { id } = req.params;

    const query = "UPDATE groups SET name = ? SET owner_id = ? WHERE id = ?";

    await db
        .query(query, [name, owner, id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const removeGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = "DELETE FROM groups WHERE id = ?";

    await db
        .query(query, [id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

// Group Members
export const getUsers = async (req: Request, res: Response) => {
    const { id } = req.params;

    const usersQuery =
        "SELECT users.id, user_id, group_id, name, streak, username FROM memberships INNER JOIN users ON users.id = memberships.user_id WHERE memberships.group_id = ?";

    const votesQuery =
        "SELECT * FROM questions INNER JOIN votes ON votes.question_id = questions.id WHERE group_id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";

    const users = await db.query<UserRow[]>(usersQuery, [id]).catch((err) => {
        res.status(400).json({ error: err });
        return;
    });

    const votes = await db
        .query<VoteRow[]>(votesQuery, [id, id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    if (!users) {
        res.status(400).json({
            error: "There was an error while getting the statistics.",
        });
        return;
    }

    if (!votes) {
        res.status(400).json({
            error: "There was an error while getting the statistics.",
        });
        return;
    }

    try {
        const voteCounts = votes[0].reduce((acc, vote) => {
            if (acc[vote.to_id]) {
                acc[vote.to_id]++;
            } else {
                acc[vote.to_id] = 1;
            }

            return acc;
        }, {} as Record<number, number>);

        const usersWithVotes = users[0].map((user) => ({
            ...user,
            voteCount: voteCounts[user.id] || 0,
        }));

        res.status(200).json(usersWithVotes);
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

export const removeUser = async (req: Request, res: Response) => {
    const { user_id, group_id } = req.body;

    const query = "DELETE FROM memberships WHERE user_id = ? AND group_id = ?";

    await db
        .query(query, [user_id, group_id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

// Group Question
export const getQuestion = async (req: Request, res: Response) => {
    const { date } = req.body;
    const { id } = req.params;

    const query = "SELECT * FROM questions WHERE group_id = ? AND date = ?";

    await db
        .query(query, [id, date])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

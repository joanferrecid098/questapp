import {
    GroupRow,
    InviteRow,
    MembershipRow,
    QuestionRow,
    UserRow,
    VoteRow,
} from "../interfaces/models";
import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import db from "../connection";

// Group Details
export const getGroups = async (req: Request, res: Response) => {
    await db
        .query("SELECT id, name, owner_id FROM groups")
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

    if (!req.user.id || !id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const infoQuery =
        "SELECT groups.id, groups.name, users.name AS owner, owner_id, question, date FROM groups INNER JOIN questions ON groups.id = questions.group_id INNER JOIN users ON groups.owner_id = users.id WHERE groups.id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";

    const votedQuery =
        "SELECT votes.id FROM votes INNER JOIN questions ON votes.question_id = questions.id WHERE votes.from_id = ? AND questions.group_id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";

    const info = await db
        .query<GroupRow[]>(infoQuery, [id, id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    const voted = await db
        .query<VoteRow[]>(votedQuery, [req.user.id, id, id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    if (!info || !voted) {
        res.status(400).json({
            error: "There was an error while getting the statistics.",
        });
        return;
    }

    try {
        const hasVoted = voted[0].length > 0 ? true : false;

        const infoWithVoted = [
            {
                ...info[0][0],
                hasVoted: hasVoted,
            },
        ];

        if (info[0].length >= 1) {
            res.status(200).json(infoWithVoted);
            return;
        } else {
            res.status(404).json({ error: "Group not found." });
            return;
        }
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

export const createGroup = async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id } = req.user;

    if (!name) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const groupQuery = "INSERT INTO groups VALUES (NULL, ?, ?)";
    const membershipQuery = "INSERT INTO memberships VALUES (NULL, ?, ?)";

    const group = await db
        .query<ResultSetHeader>(groupQuery, [name, id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    if (!group || !group[0].insertId || group[0].insertId === 0) {
        res.status(400).json({
            error: "There was an error while creating the group.",
        });
        return;
    }

    const membership = await db
        .query<ResultSetHeader>(membershipQuery, [id, group[0].insertId])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    if (!membership || !membership[0].insertId || group[0].insertId === 0) {
        res.status(400).json({
            error: "There was an error while creating the group membership.",
        });
        return;
    }

    res.status(200).json(group[0]);
    return;
};

export const updateGroup = async (req: Request, res: Response) => {
    const { name, owner } = req.body;
    const { id } = req.params;

    if (!name || !owner || !id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query = "UPDATE groups SET name = ?, owner_id = ? WHERE id = ?";

    await db
        .query(query, [name, owner, id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const removeGroup = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

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

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const usersQuery =
        "SELECT users.id, user_id, group_id, name, streak, username FROM memberships INNER JOIN users ON users.id = memberships.user_id WHERE memberships.group_id = ?";

    const votesQuery =
        "SELECT questions.id, date, from_id, to_id FROM questions INNER JOIN votes ON votes.question_id = questions.id WHERE group_id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";

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

    if (!users || !votes) {
        res.status(400).json({
            error: "There was an error while getting the statistics.",
        });
        return;
    }

    if (users[0].length < 1) {
        res.status(404).json({ error: "Group not found." });
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

    if (!user_id || !group_id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const singleQuery =
        "DELETE FROM memberships WHERE user_id = ? AND group_id = ?";
    const multipleQuery =
        "DELETE FROM memberships WHERE user_id IN (?) AND group_id = ?";

    if (typeof user_id === "string" || typeof user_id === "number") {
        await db
            .query(singleQuery, [user_id, group_id])
            .then((result) => {
                res.status(200).json(result[0]);
                return;
            })
            .catch((err) => {
                res.status(400).json({ error: err });
                return;
            });
    } else if (Array.isArray(user_id)) {
        await db
            .query(multipleQuery, [user_id, group_id])
            .then((result) => {
                res.status(200).json(result[0]);
                return;
            })
            .catch((err) => {
                res.status(400).json({ error: err });
                return;
            });
    } else {
        res.status(400).json({
            error: "Type is not compatible.",
        });
        return;
    }
};

export const joinGroup = async (req: Request, res: Response) => {
    const { uuid } = req.params;
    const { id } = req.user;

    if (!uuid) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const inviteQuery = "SELECT id, group_id FROM invites WHERE uuid = ?";
    const membershipQuery = "INSERT INTO memberships VALUES (NULL, ?, ?)";
    const deleteQuery = "DELETE FROM invites WHERE id = ?";

    const invite = await db
        .query<InviteRow[]>(inviteQuery, [uuid])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    if (!invite || invite[0].length !== 1) {
        res.status(400).json({
            error: "Invite not found.",
        });
        return;
    }

    const membership = await db
        .query<ResultSetHeader>(membershipQuery, [id, invite[0][0].group_id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    const inviteDelete = await db
        .query<ResultSetHeader>(deleteQuery, [invite[0][0].id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    if (!membership || !inviteDelete || inviteDelete[0].affectedRows != 1) {
        res.status(400).json({
            error: "There was an error while joining the group.",
        });
        return;
    }

    try {
        res.status(200).json({
            ...membership[0],
            groupId: invite[0][0].group_id,
        });
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

// Group Question
export const getQuestion = async (req: Request, res: Response) => {
    const { date } = req.body;
    const { id } = req.params;

    if (!date || !id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query =
        "SELECT id, category, question, date FROM questions WHERE group_id = ? AND date = ?";

    await db
        .query<QuestionRow[]>(query, [id, date])
        .then((result) => {
            if (result[0].length < 1) {
                res.status(404).json({ error: "Question not found." });
                return;
            }

            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

import { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import db from "../connection";
import {
    GroupRow,
    InviteRow,
    QuestionRow,
    UserRow,
    VoteRow,
} from "../interfaces/models";

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

    try {
        const infoQuery =
            "SELECT groups.id, groups.name, users.name AS owner, owner_id, question, date FROM groups INNER JOIN questions ON groups.id = questions.group_id INNER JOIN users ON groups.owner_id = users.id WHERE groups.id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";
        const [info] = await db.query<GroupRow[]>(infoQuery, [id, id]);

        const votedQuery =
            "SELECT votes.id FROM votes INNER JOIN questions ON votes.question_id = questions.id WHERE votes.from_id = ? AND questions.group_id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";
        const [voted] = await db.query<VoteRow[]>(votedQuery, [
            req.user.id,
            id,
            id,
        ]);

        if (!info || !voted) {
            res.status(400).json({
                error: "There was an error while getting the statistics.",
            });
            return;
        }

        const hasVoted = voted.length > 0 ? true : false;

        const infoWithVoted = [
            {
                ...info[0],
                hasVoted: hasVoted,
            },
        ];

        if (info.length >= 1) {
            res.status(200).json(infoWithVoted);
            return;
        } else {
            res.status(404).json({ error: "Group not found." });
            return;
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(400).json({ error: err.message });
        } else {
            return res.status(400).json({ error: "Internal server error." });
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

    try {
        const groupQuery = "INSERT INTO groups VALUES (NULL, ?, ?)";
        const [group] = await db.query<ResultSetHeader>(groupQuery, [name, id]);

        if (!group || !group.insertId || group.insertId === 0) {
            res.status(400).json({
                error: "There was an error while creating the group.",
            });
            return;
        }

        const membershipQuery = "INSERT INTO memberships VALUES (NULL, ?, ?)";
        const [membership] = await db.query<ResultSetHeader>(membershipQuery, [
            id,
            group.insertId,
        ]);

        if (!membership || !membership.insertId || group.insertId === 0) {
            res.status(400).json({
                error: "There was an error while creating the group membership.",
            });
            return;
        }

        res.status(200).json(group);
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(400).json({ error: err.message });
        } else {
            return res.status(400).json({ error: "Internal server error." });
        }
    }
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

    try {
        const usersQuery =
            "SELECT users.id, user_id, group_id, name, streak, username FROM memberships INNER JOIN users ON users.id = memberships.user_id WHERE memberships.group_id = ?";
        const [users] = await db.query<UserRow[]>(usersQuery, [id]);

        const votesQuery =
            "SELECT questions.id, date, from_id, to_id FROM questions INNER JOIN votes ON votes.question_id = questions.id WHERE group_id = ? AND questions.date = (SELECT MAX(date) FROM questions WHERE group_id = ?)";
        const [votes] = await db.query<VoteRow[]>(votesQuery, [id, id]);

        if (!users || !votes) {
            res.status(400).json({
                error: "There was an error while getting the statistics.",
            });
            return;
        }

        if (users.length < 1) {
            res.status(404).json({ error: "Group not found." });
            return;
        }

        const voteCounts = votes.reduce((acc, vote) => {
            if (acc[vote.to_id]) {
                acc[vote.to_id]++;
            } else {
                acc[vote.to_id] = 1;
            }

            return acc;
        }, {} as Record<number, number>);

        const usersWithVotes = users.map((user) => ({
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

    if (typeof user_id === "string" || typeof user_id === "number") {
        const query =
            "DELETE FROM memberships WHERE user_id = ? AND group_id = ?";

        await db
            .query(query, [user_id, group_id])
            .then((result) => {
                res.status(200).json(result[0]);
                return;
            })
            .catch((err) => {
                res.status(400).json({ error: err });
                return;
            });
    } else if (Array.isArray(user_id)) {
        const query =
            "DELETE FROM memberships WHERE user_id IN (?) AND group_id = ?";

        await db
            .query(query, [user_id, group_id])
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

export const createInvite = async (req: Request, res: Response) => {
    const { group_id } = req.body;
    const { id } = req.user;

    if (!group_id) {
        return res.status(400).json({
            error: "All fields are required.",
        });
    }

    try {
        const insertQuery = "INSERT INTO invites VALUES (NULL, ?, ?, UUID())";
        const [insert] = await db.query<ResultSetHeader>(insertQuery, [
            id,
            group_id,
        ]);

        if (!insert || insert.affectedRows === 0) {
            return res.status(400).json({
                error: "There was an error creating the invite.",
            });
        }

        const inviteQuery = "SELECT uuid FROM invites WHERE id = ?";
        const [invite] = await db.query<InviteRow[]>(inviteQuery, [
            insert.insertId,
        ]);

        if (!invite || invite.length === 0) {
            return res.status(400).json({
                error: "There was an error retrieving the invite.",
            });
        }

        return res.status(200).json({
            invite_uuid: invite[0].uuid,
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res.status(400).json({ error: err.message });
        } else {
            return res.status(400).json({ error: "Internal server error." });
        }
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

    try {
        const inviteQuery = "SELECT id, group_id FROM invites WHERE uuid = ?";
        const [invite] = await db.query<InviteRow[]>(inviteQuery, [uuid]);

        if (!invite || invite.length !== 1) {
            res.status(404).json({
                error: "Invite not found.",
            });
            return;
        }

        const membershipQuery = "INSERT INTO memberships VALUES (NULL, ?, ?)";
        const [membership] = await db.query<ResultSetHeader>(membershipQuery, [
            id,
            invite[0].group_id,
        ]);

        const deleteQuery = "DELETE FROM invites WHERE id = ?";
        const [inviteDelete] = await db.query<ResultSetHeader>(deleteQuery, [
            invite[0].id,
        ]);

        if (!membership || !inviteDelete || inviteDelete.affectedRows != 1) {
            res.status(400).json({
                error: "There was an error while joining the group.",
            });
            return;
        }

        res.status(200).json({
            ...membership,
            groupId: invite[0].group_id,
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

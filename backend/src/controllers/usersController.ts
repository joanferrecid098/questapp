import { NotificationRow, QuestionRow, UserRow } from "../interfaces/models";
import { signup, login, changePassword } from "../functions/usersManager";
import { Response, Request } from "express";
import { RowDataPacket } from "mysql2";
import validator, { toDate } from "validator";
import jwt from "jsonwebtoken";
import db from "../connection";

const createToken = (_id: number) => {
    return jwt.sign({ _id }, process.env.SECRET!, { expiresIn: "3d" });
};

// User Details
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await login(username, password);

        const token = createToken(user[0].id);

        res.status(200).json({ username, token });
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

export const signupUser = async (req: Request, res: Response) => {
    const { name, username, password } = req.body;

    try {
        const user = await signup(name, username, password);

        const token = createToken(user.insertId);

        res.status(200).json({ username, token });
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

export const updateUser = async (req: Request, res: Response) => {
    const { name, username } = req.body;
    const { id } = req.user;

    if (!username) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    if (!validator.isAlphanumeric(username)) {
        res.status(400).json({ error: "Username is not valid." });
        return;
    }

    const query = "UPDATE users SET name = ?, username = ? WHERE id = ?";

    await db
        .query(query, [name, username, id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const updatePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    try {
        const confirm = await changePassword(
            id.toString(),
            oldPassword,
            newPassword
        );

        if (confirm[0].affectedRows != 1) {
            res.status(400).json({ error: "Internal server error." });
            return;
        }

        res.status(200).json({
            message: "Password has been successfully updated.",
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

export const removeUser = async (req: Request, res: Response) => {
    const { id } = req.user;

    const query = "DELETE FROM users WHERE id = ?";

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

export const getUserInfo = async (req: Request, res: Response) => {
    const { id } = req.user;

    const query = "SELECT id, name, username FROM users WHERE id = ?";

    await db
        .query<UserRow[]>(query, [id])
        .then((result) => {
            if (result[0].length < 1) {
                res.status(404).json({ error: "User not found." });
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

export const getUserStats = async (req: Request, res: Response) => {
    const { id } = req.user;

    try {
        const streakQuery =
            "SELECT date FROM votes INNER JOIN questions ON questions.id = votes.question_id WHERE from_id = ? GROUP BY date";
        const [streak] = await db.query<RowDataPacket[]>(streakQuery, [
            req.user.id,
        ]);

        if (!streak) {
            res.status(400).json({
                error: "There was an error while getting the statistics.",
            });
            return;
        }

        const membershipQuery =
            "SELECT (SELECT COUNT(*) FROM memberships WHERE user_id = ?) AS joined_groups, (SELECT COUNT(*) FROM groups WHERE owner_id = ?) AS owned_groups FROM dual";
        const [counts] = await db.query<RowDataPacket[]>(membershipQuery, [
            id,
            id,
        ]);

        const votesQuery =
            "SELECT votes.id, from_id, to_id FROM votes INNER JOIN questions ON questions.id = votes.question_id INNER JOIN memberships ON memberships.group_id = questions.group_id WHERE memberships.user_id = ? AND date = CURDATE()";
        const [votes] = await db.query<QuestionRow[]>(votesQuery, [id]);

        if (!counts || !votes) {
            res.status(400).json({
                error: "There was an error while getting the statistics.",
            });
            return;
        }

        let streakCount = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        streak
            .map((d) => new Date(d.date).setHours(0, 0, 0, 0))
            .sort((a, b) => b - a)
            .some((date, i, arr) => {
                if (i > 0 && arr[i - 1] - date !== 86400000) return true;
                streakCount +=
                    date === today.getTime() || streakCount > 0 ? 1 : 0;
            });

        const allVotes = votes;
        const userVotes = votes.filter((vote) => vote.to_id === id);

        res.status(200).json([
            {
                streak: streakCount,
                joinedGroups: counts[0].joined_groups,
                ownedGroups: counts[0].owned_groups,
                votes: {
                    votedPercentage:
                        (userVotes.length / allVotes.length || 0) * 100,
                    allVotes: allVotes.length,
                    userVotes: userVotes.length,
                },
            },
        ]);
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

export const getNotifications = async (req: Request, res: Response) => {
    const { id } = req.user;

    const query =
        "SELECT notifications.id, group_id, notifications, last_update, name FROM notifications INNER JOIN groups ON notifications.group_id = groups.id WHERE user_id = ?";

    await db
        .query<NotificationRow[]>(query, [id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

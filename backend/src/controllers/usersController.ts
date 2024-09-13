import { signup, login } from "../functions/usersManager";
import { Response, Request } from "express";
import db from "../connection";

// User Details
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await login(username, password);

        // SUCCESS

        res.status(200).json({ username });
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
    const { username, password } = req.body;

    try {
        const user = await signup(username, password);

        // SUCCESS

        res.status(200).json({ username });
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
    const { username, password } = req.body;
    const { id } = req.params;

    const query = "UPDATE users SET username = ?, password = ? WHERE id = ?";

    await db
        .query(query, [username, password, id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const removeUser = async (req: Request, res: Response) => {
    const { id } = req.params;

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

// User Memberships
export const getGroups = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query =
        "SELECT * FROM memberships INNER JOIN groups ON groups.id = memberships.group_id WHERE memberships.group_id = ?";

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

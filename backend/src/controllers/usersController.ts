import { Response, Request } from "express";
import db from "../connection";

// User Details
export const getUsers = async (req: Request, res: Response) => {
    await db
        .query("SELECT * FROM users")
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = "SELECT * FROM users WHERE id = ?";

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

export const createUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const query = "INSERT INTO users VALUES (NULL, ?, ?)";

    await db
        .query(query, [username, password])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
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

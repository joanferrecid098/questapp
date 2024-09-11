import { Request, Response } from "express";
import db from "../connection";

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

    const query = "SELECT * FROM groups WHERE id = ?";

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

export const createGroup = async (req: Request, res: Response) => {
    const { name } = req.body;

    const query = "INSERT INTO groups VALUES (NULL, ?)";

    await db
        .query(query, [name])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const updateGroup = async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id } = req.params;

    const query = "UPDATE groups SET name = ? WHERE id = ?";

    await db
        .query(query, [name, id])
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

    const query =
        "SELECT * FROM memberships INNER JOIN users ON users.id = memberships.user_id WHERE memberships.user_id = ?";

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

export const addUser = async (req: Request, res: Response) => {
    const { user_id, group_id } = req.body;

    const query = "INSERT INTO memberships VALUES (NULL, ?, ?)";

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

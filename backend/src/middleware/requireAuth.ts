import { NextFunction, Response, Request } from "express";
import { JWTUserId } from "../interfaces/sessions";
import { UserRow } from "../interfaces/models";
import jwt from "jsonwebtoken";
import db from "../connection";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    // Verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).json({ error: "Authorization token required." });
        return;
    }

    const token = authorization.toString().split(" ")[1];

    try {
        const { _id } = <JWTUserId>jwt.verify(token, process.env.SECRET!);

        const query = "SELECT id, name, username FROM users WHERE id = ?";

        await db
            .query<UserRow[]>(query, [_id])
            .then((result) => {
                if (result[0].length < 1) {
                    res.status(404).json({ error: "User not found." });
                    return;
                }

                // Pass user to endpoints
                req.user = result[0][0];
                next();
            })
            .catch((err) => {
                res.status(400).json({ error: err });
                return;
            });
    } catch (err) {
        res.status(401).json({ error: "Request is not authorized" });
        return;
    }
};

export default requireAuth;

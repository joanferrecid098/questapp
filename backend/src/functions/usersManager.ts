import { RowDataPacket } from "mysql2";
import validator from "validator";
import db from "../connection";
import bcrypt from "bcrypt";

interface User {
    id: number;
    username: string;
    password: string;
}

// User signup method
export const signup = async (username: string, password: string) => {
    // Validation
    if (!username || !password) {
        throw Error("All fields must be filled.");
    }

    if (!validator.isAlphanumeric(username)) {
        throw Error("Username is not valid.");
    }

    if (
        !validator.isStrongPassword(password, {
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
        })
    ) {
        throw Error("Password is not strong enough.");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = "INSERT INTO users VALUES (NULL, ?, ?)";

    const user = await db
        .query<RowDataPacket[]>(query, [username, hash])
        .catch((err) => {
            if (err.errno == 1062) {
                throw Error("Username already in use.");
            }
            throw Error(err);
        });

    return user[0];
};

// User login method
export const login = async (username: string, password: string) => {
    // Validation
    if (!username || !password) {
        throw Error("All fields must be filled.");
    }

    const query = "SELECT * FROM users WHERE username = ?";

    const user = await db
        .query<RowDataPacket[]>(query, [username])
        .catch((err) => {
            if (err.errno == 1062) {
                throw Error("Username already in use.");
            }
            throw Error(err);
        });

    if (!user[0][0]) {
        throw Error("Invalid login credentials.");
    }

    const match = await bcrypt.compare(password, user[0][0].password);

    if (!match) {
        throw Error("Invalid login credentials.");
    }

    return user[0];
};

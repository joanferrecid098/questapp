import { UserRow } from "../interfaces/models";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import validator from "validator";
import db from "../connection";
import bcrypt from "bcrypt";

// User signup method
export const signup = async (
    name: string,
    username: string,
    password: string
) => {
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

    const query = "INSERT INTO users VALUES (NULL, ?, ?, ?)";

    const user = await db
        .query<ResultSetHeader>(query, [name, username, hash])
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

    const user = await db.query<UserRow[]>(query, [username]).catch((err) => {
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

// Change password
export const changePassword = async (
    id: string,
    oldPassword: string,
    newPassword: string
) => {
    // Validation
    if (!id || !oldPassword || !newPassword) {
        throw Error("All fields must be filled.");
    }

    const checkQuery = "SELECT * FROM users WHERE id = ?";

    const user = await db.query<UserRow[]>(checkQuery, [id]).catch((err) => {
        throw Error(err);
    });

    if (!user[0][0]) {
        throw Error("Invalid login credentials.");
    }

    // Check old password
    const match = await bcrypt.compare(oldPassword, user[0][0].password);

    if (!match) {
        throw Error("Password is not correct.");
    }

    // Check new password
    if (
        !validator.isStrongPassword(newPassword, {
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
    const hash = await bcrypt.hash(newPassword, salt);

    // Update password
    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";

    const update = await db
        .query<ResultSetHeader>(updateQuery, [hash, id])
        .catch((err) => {
            throw Error(err);
        });

    return update;
};

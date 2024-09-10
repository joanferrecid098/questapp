import { Response, Request } from "express";

// User Details
export const getUsers = async (req: Request, res: Response) => {
    res.send("Get the user list");
};

export const getUser = async (req: Request, res: Response) => {
    res.send("Get a user's details");
};

export const createUser = async (req: Request, res: Response) => {
    res.send("Create a user");
};

export const updateUser = async (req: Request, res: Response) => {
    res.send("Update a user's details");
};

export const removeUser = async (req: Request, res: Response) => {
    res.send("Delete a user");
};

// User Memberships
export const getGroups = async (req: Request, res: Response) => {
    res.send("Get a user's groups");
};

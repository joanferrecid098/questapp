import { Request, Response } from "express";

// Group Details
export const getGroups = async (req: Request, res: Response) => {
    res.send("Get the group list");
};

export const getGroup = async (req: Request, res: Response) => {
    res.send("Get a group's details");
};

export const createGroup = async (req: Request, res: Response) => {
    res.send("Create a group");
};

export const updateGroup = async (req: Request, res: Response) => {
    res.send("Update a group's details");
};

export const removeGroup = async (req: Request, res: Response) => {
    res.send("Delete a group");
};

// Group Members
export const getUsers = async (req: Request, res: Response) => {
    res.send("Get a group's users");
};

export const addUser = async (req: Request, res: Response) => {
    res.send("Add a user to the group");
};

export const removeUser = async (req: Request, res: Response) => {
    res.send("Remove a user from the group");
};

// Group Question
export const getQuestion = async (req: Request, res: Response) => {
    res.send("Get the daily question");
};

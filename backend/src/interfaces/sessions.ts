import { JwtPayload } from "jsonwebtoken";
import { User } from "./models";
import express from "express";

export interface JWTUserId extends JwtPayload {
    _id: number;
}

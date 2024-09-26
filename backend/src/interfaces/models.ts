import { RowDataPacket } from "mysql2";

export interface Group {
    id: number;
    name: string;
    owner_id: number;
}

export interface Invite {
    id: number;
    from_id: number;
    group_id: number;
    uuid: string;
}

export interface Membership {
    id: number;
    user_id: number;
    group_id: number;
}

export interface Notification {
    id: number;
    user_id: number;
    group_id: number;
    notifications: number;
    last_update: number;
}

export interface Question {
    id: number;
    category: string;
    question: string;
    group_id: number;
    date: number;
}

export interface User {
    id: number;
    name: string;
    streak: number;
    username: string;
    password: string;
}

export interface Vote {
    id: number;
    from_id: number;
    to_id: number;
    question_id: number;
}

export interface GroupRow extends RowDataPacket, Group {}
export interface InviteRow extends RowDataPacket, Invite {}
export interface MembershipRow extends RowDataPacket, Membership {}
export interface NotificationRow extends RowDataPacket, Notification {}
export interface QuestionRow extends RowDataPacket, Question {}
export interface UserRow extends RowDataPacket, User {}
export interface VoteRow extends RowDataPacket, Vote {}

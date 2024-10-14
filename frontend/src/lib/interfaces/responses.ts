/* Default */
export interface ResponseInfo {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
    changedRows: number;
}

/* Users */
export interface GetUserInfo {
    id: number;
    name: string;
    username: string;
}

export interface GetUserStats {
    streak: number;
    joinedGroups: number;
    ownedGroups: number;
    votes: {
        votedPercentage: number;
        allVotes: number;
        userVotes: number;
    };
}

export interface ChangePassword {
    error: string;
    message: string;
}

export interface GetNotifications {
    id: number;
    group_id: number;
    notifications: number;
    last_update: string;
    name: string;
}

/* Groups */
export interface GetGroup {
    id: number;
    name: string;
    owner: string;
    owner_id: number;
    category: string;
    question: string;
    group_id: number;
    date: string;
    hasVoted: boolean;
    isOwner: boolean;
    last_updated: string;
}

export interface GetGroupUsers {
    id: number;
    user_id: number;
    group_id: number;
    name: string;
    streak: number;
    username: string;
    voteCount: number;
}

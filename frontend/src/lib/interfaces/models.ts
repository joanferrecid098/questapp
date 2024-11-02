export interface ResultSetHeader {
    affectedRows: number;
    fieldCount: number;
    info: string;
    insertId: number;
    serverStatus: number;
    warningStatus: number;
}

export interface UserDetails {
    id: number;
    name?: string;
    username?: string;
    percentage?: number;
    searchTerms?: string;
    isOwner?: boolean;
}

export interface GroupDetails {
    id: number;
    name: string;
    owner?: string;
    owner_id: number;
    isOwner?: boolean;
    last_updated?: string;
    question?: string;
    nextQuestion?: string;
    hasVoted?: boolean;
}

export interface UserStats {
    dailyStreak: number;
    joinedGroups: number;
    ownedGroups: number;
    votedPercentage: number;
}

export interface GroupStats {
    id: number;
    name: string;
    update: string;
    notifications: number;
}

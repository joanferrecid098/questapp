export interface UserDetails {
    id: number;
    name?: string;
    username?: string;
    percentage?: number;
    searchTerms?: string;
}

export interface GroupDetails {
    id: number;
    name: string;
    owner?: string;
    ownerId: number;
    nextQuestion?: string;
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

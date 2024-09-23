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

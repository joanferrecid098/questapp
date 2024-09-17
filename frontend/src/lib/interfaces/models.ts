export interface UserDetails {
    id: number;
    name?: string;
    username?: string;
    percentage?: number;
}

export interface GroupDetails {
    id: number;
    name: string;
    owner?: string;
    ownerId: number;
    nextQuestion?: string;
}

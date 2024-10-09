import { sessionStore } from "$stores/auth";
import { get } from "svelte/store";
import type {
    GetGroup,
    GetGroupUsers,
    GetNotifications,
    GetUserInfo,
    GetUserStats,
} from "$interfaces/responses";
import type {
    GroupDetails,
    ResultSetHeader,
    UserDetails,
} from "$interfaces/models";

export const base = "http://localhost:8080";

/* Fetching */
interface SendOptions {
    method: string;
    path: string;
    data?: unknown;
}

export const send = async <T>({
    method,
    path,
    data,
}: SendOptions): Promise<T> => {
    const opts: RequestInit = { method, headers: {}, body: undefined };

    if (data) {
        opts.headers = {
            ...opts.headers,
            "Content-Type": "application/json",
        };
        opts.body = JSON.stringify(data);
    }

    if (get(sessionStore) !== "") {
        opts.headers = {
            ...opts.headers,
            Authorization: `Token ${get(sessionStore)}`,
        };
    }

    const response = await fetch(`${base}${path}`, opts);

    if (!response.ok) {
        // if (response.status === 401) sessionStore.set("");
        throw new Error((await response.json()).error || response.statusText);
    }

    return (await response.json()) as T;
};

/* Users */
export const getUserInfo = async () => {
    const response = await send<GetUserInfo[]>({
        method: "GET",
        path: `/api/users/user`,
    });

    return {
        id: response[0].id,
        name: response[0].name,
        username: response[0].username,
    };
};

export const getUserStats = async () => {
    const response = await send<GetUserStats[]>({
        method: "GET",
        path: `/api/users/stats`,
    });

    return {
        dailyStreak: response[0].streak,
        joinedGroups: response[0].joinedGroups,
        ownedGroups: response[0].ownedGroups,
        votedPercentage: Math.round(response[0].votes.votedPercentage),
    };
};

export const changePassword = async (
    oldPassword: string,
    newPassword: string
) => {
    const response = await send<GetUserStats[]>({
        method: "PATCH",
        path: `/api/users/password`,
        data: {
            oldPassword,
            newPassword,
        },
    });

    return response;
};

export const patchUser = async ({ name, username }: UserDetails) => {
    const response = await send<ResultSetHeader>({
        method: "PATCH",
        path: `/api/users/user`,
        data: {
            name,
            username,
        },
    });

    return response;
};

export const removeAccount = async () => {
    const response = await send<ResultSetHeader>({
        method: "DELETE",
        path: `/api/users/user`,
    });

    return response;
};

export const getNotifications = async () => {
    const response = await send<GetNotifications[]>({
        method: "GET",
        path: `/api/users/notifications`,
    });

    return response.map((notification) => ({
        id: notification.group_id,
        name: notification.name,
        update: notification.last_update,
        notifications: notification.notifications,
    }));
};

/* Groups */
export const getGroups = async () => {
    const response = await send<GroupDetails[]>({
        method: "GET",
        path: `/api/groups`,
    });

    return response;
};

export const getGroup = async (id: number) => {
    const response = await send<GetGroup[]>({
        method: "GET",
        path: `/api/groups/group/${id}`,
    });

    return {
        id: id,
        name: response[0].name,
        owner: response[0].owner,
        owner_id: response[0].owner_id,
        question: response[0].question,
        hasVoted: response[0].hasVoted,
    };
};

export const createGroup = async (groupDetails: GroupDetails) => {
    const response = await send<ResultSetHeader>({
        method: "POST",
        path: `/api/groups`,
        data: {
            name: groupDetails.name,
        },
    });

    return response;
};

export const updateGroup = async (
    groupDetails: GroupDetails,
    removedUsers: UserDetails[]
) => {
    const update = await send<ResultSetHeader>({
        method: "PATCH",
        path: `/api/groups/group/${groupDetails.id}`,
        data: {
            name: groupDetails.name,
            owner: groupDetails.owner_id,
        },
    });

    if (removedUsers.length > 0) {
        const user_id = removedUsers.map((user) => user.id);

        const remove = await send<ResultSetHeader>({
            method: "DELETE",
            path: `/api/groups/users`,
            data: {
                user_id,
                group_id: groupDetails.id,
            },
        });

        return {
            update,
            remove,
        };
    }

    return {
        update,
    };
};

export const getGroupUsers = async (id: number) => {
    const response = await send<GetGroupUsers[]>({
        method: "GET",
        path: `/api/groups/users/${id}`,
    });

    let totalVotes = 0;
    response.forEach((user) => (totalVotes += user.voteCount));

    return response.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        percentage: Math.round((user.voteCount / totalVotes) * 100) || 0,
    }));
};

export const acceptInvite = async (uuid: string) => {
    const response = await send<ResultSetHeader & { groupId: number }>({
        method: "POST",
        path: `/api/groups/invite/${uuid}`,
    });

    return response;
};

/* Votes */
export const postVote = async (to_id: number, group_id: number) => {
    const response = await send<GetGroupUsers[]>({
        method: "POST",
        path: `/api/votes`,
        data: {
            to_id,
            group_id,
        },
    });

    return response;
};

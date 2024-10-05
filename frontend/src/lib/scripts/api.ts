import type { GroupDetails, UserDetails } from "$lib/interfaces/models";
import type {
    GetGroup,
    GetGroupUsers,
    GetNotifications,
    GetUserInfo,
    GetUserStats,
} from "$lib/interfaces/responses";
import { sessionStore } from "$stores/auth";
import { get } from "svelte/store";

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
        throw new Error(response.statusText);
    }

    return (await response.json()) as T;
};

/* Users */
export const getUserInfo = async (id: number) => {
    const response = await send<GetUserInfo[]>({
        method: "get",
        path: `/api/users/user/${id}`,
    });

    return {
        id: response[0].id,
        name: response[0].name,
        username: response[0].username,
    };
};

export const getUserStats = async (id: number) => {
    const response = await send<GetUserStats[]>({
        method: "get",
        path: `/api/users/stats/${id}`,
    });

    return {
        dailyStreak: response[0].streak,
        joinedGroups: response[0].joinedGroups,
        ownedGroups: response[0].ownedGroups,
        votedPercentage: Math.round(response[0].votes.votedPercentage),
    };
};

export const changePassword = (oldPassword: string, newPassword: string) => {
    console.log("change password to the following");
    console.log(newPassword);

    const response = {
        success: true,
    };

    return response;
};

export const patchUser = ({ id, name, username }: UserDetails) => {
    console.log("Account updated.");
    console.log(id, name, username);

    const response = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "Rows matched: 1  Changed: 1  Warnings: 0",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 1,
    };

    return response;
};

export const removeAccount = (accountDetails: UserDetails) => {
    console.log("delete following account:");
    console.log(accountDetails);

    const response = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0,
    };

    return response;
};

export const getNotifications = async (id: number) => {
    const response = await send<GetNotifications[]>({
        method: "get",
        path: `/api/users/notifications/${id}`,
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
        method: "get",
        path: `/api/groups`,
    });

    return response;
};

export const getGroup = async (id: number) => {
    const response = await send<GetGroup[]>({
        method: "post",
        path: `/api/groups/group/${id}`,
        data: {
            from_id: "2",
        },
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

export const createGroup = (groupDetails: GroupDetails) => {
    console.log("create group with following information:");
    console.log(groupDetails);

    const response = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 5,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0,
    };

    return response;
};

export const updateGroup = (
    groupDetails: GroupDetails,
    removedUsers: UserDetails[]
) => {
    console.log("update group details with following information");
    console.log(groupDetails);
    console.log("remove following users:");
    console.log(removedUsers);

    const response = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "Rows matched: 1  Changed: 1  Warnings: 0",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 1,
    };

    return response;
};

export const getGroupUsers = async (id: number) => {
    const response = await send<GetGroupUsers[]>({
        method: "get",
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

/* Votes */
export const postVote = (from_id: number, to_id: number, group_id: number) => {
    const response = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 8,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0,
    };

    return response;
};

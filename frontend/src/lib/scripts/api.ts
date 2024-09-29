import type { GroupDetails, UserDetails } from "$lib/interfaces/models";

/* Users */
export const getUserInfo = (id: number) => {
    const response = [
        {
            id: 1,
            name: "name-1",
            username: "test-1",
        },
    ];

    return {
        id: response[0].id,
        name: response[0].name,
        username: response[0].username,
    };
};

export const getUserStats = (id: number) => {
    const response = [
        {
            streak: 0,
            joinedGroups: 1,
            ownedGroups: 1,
            votes: {
                votedPercentage: 66.66666666666666,
                allVotes: 3,
                userVotes: 2,
            },
        },
    ];

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
        message: "Password has been successfully updated.",
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

    return;
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

export const getNotifications = (id: number) => {
    const response = [
        {
            id: 1,
            user_id: 1,
            group_id: 1,
            notifications: 5,
            last_update: "2024-09-28",
            name: "Example Group",
            owner_id: 1,
        },
        {
            id: 2,
            user_id: 2,
            group_id: 2,
            notifications: 4,
            last_update: "2024-09-26",
            name: "Example Group 2",
            owner_id: 2,
        },
    ];

    return response.map((notification) => ({
        id: notification.group_id,
        name: notification.name,
        update: notification.last_update,
        notifications: notification.notifications,
    }));
};

/* Groups */
export const getGroups = () => {
    const response = [
        {
            id: 1,
            name: "group-1",
            owner_id: 1,
        },
        {
            id: 2,
            name: "group-2",
            owner_id: 2,
        },
        {
            id: 3,
            name: "group-3",
            owner_id: 3,
        },
        {
            id: 4,
            name: "group-4",
            owner_id: 4,
        },
        {
            id: 5,
            name: "group1",
            owner_id: 1,
        },
    ];

    return response;
};

export const getGroup = (id: number) => {
    const response = [
        {
            id: 2,
            name: "Example Group",
            owner_id: 2,
            category: "category-2",
            question: "Who would be more likely to become an Olympic athelete?",
            group_id: 2,
            date: "2024-09-26T00:00:00.000Z",
            hasVoted: true,
        },
    ];

    return {
        id: id,
        name: response[0].name,
        owner: "Russell",
        owner_id: response[0].owner_id,
        question: response[0].question,
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

export const getGroupUsers = (id: number) => {
    const response = [
        {
            id: 3,
            user_id: 3,
            group_id: 3,
            name: "name-3",
            streak: 0,
            username: "test-3",
            voteCount: 2,
        },
        {
            id: 4,
            user_id: 4,
            group_id: 3,
            name: "name-4",
            streak: 0,
            username: "test-4",
            voteCount: 2,
        },
    ];

    let totalVotes = 0;
    response.forEach((user) => (totalVotes += user.voteCount));

    return response.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        percentage: (user.voteCount / totalVotes) * 100,
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

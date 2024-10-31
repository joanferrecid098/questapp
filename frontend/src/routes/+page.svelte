<script lang="ts">
    import type { MessageContent } from "$interfaces/components";
    import { getRelativeDate } from "$scripts/dates";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import {
        PendingNotification,
        LoadingBar,
        CreateGroup,
        Message,
    } from "$components";
    import {
        acceptInvite,
        createGroup,
        getNotifications,
        getUserStats,
    } from "$scripts/api";
    import type {
        GroupDetails,
        GroupStats,
        UserStats,
    } from "$interfaces/models";
    import JoinGroup from "$components/Groups/JoinGroup.svelte";

    /* Variables */
    let createGroupActive: boolean = false;
    let joinGroupActive: boolean = false;

    /* API Responses */
    let userStats: UserStats;
    let groupStats: GroupStats[];

    onMount(async () => {
        await getUserStats()
            .then((response) => {
                userStats = response;
            })
            .catch((error) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Error",
                        content: error.message,
                        type: "error",
                    },
                ];
            });
        await getNotifications()
            .then((response) => {
                groupStats = response;
            })
            .catch((error) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Error",
                        content: error.message,
                        type: "error",
                    },
                ];
            });
    });

    /* Messages */
    let messageList: MessageContent[] = [];

    const closeDialogue = (messageContent: MessageContent) => {
        const index = messageList.indexOf(messageContent);

        if (index > -1) {
            messageList = [
                ...messageList.slice(0, index),
                ...messageList.slice(index + 1),
            ];
        }
    };

    /* API Requests */
    const saveGroup = async (groupDetails: GroupDetails) => {
        if (!groupDetails) {
            createGroupActive = false;
            return;
        }

        await createGroup(groupDetails)
            .then((response) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Success",
                        content: "Successfully created group.",
                        type: "info",
                    },
                ];

                goto("/groups/" + response.insertId + "?new-group");
            })
            .catch((error) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Error",
                        content: error.message,
                        type: "error",
                    },
                ];
            });
    };

    const joinGroup = async (invite_id: string) => {
        if (!invite_id) {
            joinGroupActive = false;
            return;
        }

        await acceptInvite(invite_id)
            .then((response) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Success",
                        content: "Successfully joined group.",
                        type: "info",
                    },
                ];

                joinGroupActive = false;
                goto("/groups/" + response.group_id + "?join-group");
            })
            .catch((error) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Error",
                        content: error.message,
                        type: "error",
                    },
                ];
            });
    };
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<section>
    <div class="header">
        <h1>Home</h1>
    </div>
    {#if userStats && groupStats}
        {#if userStats.joinedGroups == 0}
            <div class="pending">
                <div class="container">
                    <h2>Pending</h2>
                </div>
                <div class="container">
                    <p class="empty">No new notifications</p>
                </div>
            </div>
            <button
                class="btn create"
                on:click={() => (createGroupActive = true)}
            >
                <i class="material-symbols-outlined">add</i>
                <p>Create your first group</p>
            </button>
            <button class="btn join" on:click={() => (joinGroupActive = true)}>
                <i class="material-symbols-outlined">add</i>
                <p>Join a group</p>
            </button>
        {:else}
            <div class="pending">
                <div class="container">
                    <h2>Pending</h2>
                </div>
                {#if groupStats.length == 0}
                    <div class="container">
                        <p class="empty">No new notifications</p>
                    </div>
                {:else}
                    {#each groupStats as group}
                        <PendingNotification
                            title={group.name}
                            update={getRelativeDate(group.update)}
                            notifications={group.notifications}
                            groupId={group.id}
                        />
                    {/each}
                {/if}
            </div>
            <div class="statistics">
                <div class="container">
                    <h2>Statistics</h2>
                </div>
                <div class="container stat-contents">
                    <p>How many times were you voted?</p>
                    <LoadingBar progress={userStats.votedPercentage} />
                </div>
            </div>
            <div class="information">
                <div class="container">
                    <h2>Information</h2>
                </div>
                <div class="container info-contents">
                    <p>
                        <strong>Daily streak:</strong>
                        {userStats.dailyStreak}
                    </p>
                    <p>
                        <strong>Groups you participate in:</strong>
                        {userStats.joinedGroups}
                    </p>
                    <p>
                        <strong>Groups you are the owner in:</strong>
                        {userStats.ownedGroups}
                    </p>
                </div>
            </div>
        {/if}
    {/if}
</section>
{#if createGroupActive}
    <CreateGroup {saveGroup} />
{/if}
{#if joinGroupActive}
    <JoinGroup {joinGroup} />
{/if}
{#if messageList.length > 0}
    <div class="message-tray">
        {#each messageList as messageContent}
            <Message {messageContent} {closeDialogue} />
        {/each}
    </div>
{/if}

<style>
    /* Sections */
    section {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 1.5rem;
        width: 100%;
        height: 100%;
    }

    .header {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 2rem;
    }

    .pending {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.0625rem;
        width: 100%;
    }

    .statistics {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.0625rem;
        width: 100%;
    }

    .information {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.0625rem;
        width: 100%;
    }

    .container {
        background-color: var(--color-bg-2);

        height: auto;
        width: 100%;
        padding: 0.5rem 1rem 0.5rem 1rem;
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        align-items: start;
        align-content: stretch;
        justify-content: start;
    }

    .btn {
        cursor: pointer;
        height: 2.375rem;
        width: 100%;
        padding: 0.5rem 1rem;
        box-sizing: border-box;
        font-size: 1rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: center;
        gap: 0.75rem;
    }

    .create {
        background-color: var(--color-accent-yellow);
    }

    .join {
        background-color: var(--color-bg-2);
    }

    .stat-contents {
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 1rem;
    }

    .info-contents {
        flex-direction: column;
        gap: 0.5rem;
    }

    /* Elements */
    .empty {
        font-size: 1rem;
        font-style: italic;
    }

    .create > p {
        color: var(--color-primary-black);
    }

    .create > i {
        color: var(--color-primary-black);
    }
</style>

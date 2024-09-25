<script lang="ts">
    import { PendingNotification, LoadingBar, CreateGroup } from "$components";
    import { getRelativeDate } from "$scripts/dates";
    import type {
        GroupDetails,
        GroupStats,
        UserDetails,
        UserStats,
    } from "$lib/interfaces/models";

    let createGroupActive: boolean = false;

    /* API Responses */
    const userStats: UserStats = {
        dailyStreak: 8,
        joinedGroups: 3,
        ownedGroups: 1,
        votedPercentage: 50,
    };

    const groupStats: GroupStats[] = [
        {
            id: 1,
            name: "Example Group",
            update: "2024-09-25",
            notifications: 1,
        },
        {
            id: 2,
            name: "Example Group 2",
            update: "2024-12-13",
            notifications: 6,
        },
    ];

    /* API Requests */
    const saveGroup = (
        groupDetails: GroupDetails,
        userArray: UserDetails[],
    ) => {
        if (!groupDetails || !userArray) {
            createGroupActive = false;
            return;
        }
        console.log("create group with following information:");
        console.log(groupDetails);
        console.log("create group with following users:");
        console.log(userArray);
    };
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<section>
    <div class="header">
        <h1>Home</h1>
    </div>
    {#if userStats.joinedGroups == 0}
        <div class="pending">
            <div class="container">
                <h2>Pending</h2>
            </div>
            <div class="container">
                <p class="empty">No new notifications</p>
            </div>
        </div>
        <button class="btn create" on:click={() => (createGroupActive = true)}>
            <i class="material-symbols-outlined">add</i>
            <p>Create your first group</p>
        </button>
        <button class="btn join" on:click={() => alert(2)}>
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
                <p><strong>Daily streak:</strong> {userStats.dailyStreak}</p>
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
</section>
{#if createGroupActive}
    <CreateGroup {saveGroup} />
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
        height: 3rem;
        width: 100%;
        padding: 1rem 1.5rem;
        box-sizing: border-box;

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

    .btn {
        font-size: 1.25rem;
    }

    .create > p {
        color: var(--color-primary-black);
    }

    .create > i {
        color: var(--color-primary-black);
    }
</style>

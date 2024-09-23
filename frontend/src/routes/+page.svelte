<script lang="ts">
    import { PendingNotification, LoadingBar, CreateGroup } from "$components";
    import type { GroupDetails, UserDetails } from "$lib/interfaces/models";

    let createGroupActive: boolean = false;

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
    <div class="pending">
        <div class="container">
            <h2>Pending</h2>
        </div>
        <PendingNotification
            title="Example Group"
            update="Today"
            notifications="1"
            groupId="1"
        />
        <PendingNotification
            title="Example Group 2"
            update="Yesterday"
            notifications="6"
            groupId="2"
        />
    </div>
    <div class="statistics">
        <div class="container">
            <h2>Statistics</h2>
        </div>
        <div class="container stat-contents">
            <p>How many times were you voted?</p>
            <LoadingBar progress={50} />
        </div>
    </div>
    <div class="information">
        <div class="container">
            <h2>Information</h2>
        </div>
        <div class="container info-contents">
            <p><strong>Daily streak:</strong> 8</p>
            <p><strong>Groups you participate in:</strong> 3</p>
            <p><strong>Groups you are the owner in:</strong> 1</p>
        </div>
    </div>
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

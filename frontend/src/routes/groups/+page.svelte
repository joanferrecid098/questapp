<script lang="ts">
    import { GroupElement, CreateGroup } from "$components";
    import {
        type GroupDetails,
        type UserDetails,
    } from "$lib/interfaces/models";

    /* Variables */
    let createGroupActive: boolean = false;

    /* API Responses */
    const groups: GroupDetails[] = [
        {
            id: 1,
            name: "Example Group",
            ownerId: 2,
        },
        {
            id: 2,
            name: "Example Group 2",
            ownerId: 1,
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

        // SEND API REQUEST
        createGroupActive = false;

        console.log("create group with following information:");
        console.log(groupDetails);
        console.log("create group with following users:");
        console.log(userArray);
    };
</script>

<svelte:head>
    <title>Groups</title>
</svelte:head>

<section>
    {#if createGroupActive}
        <CreateGroup {saveGroup} />
    {/if}
    <div class="header">
        <h1>My Groups</h1>
    </div>
    <input type="text" class="search" placeholder=" Search" />
    <div class="groups">
        {#each groups as group}
            <GroupElement
                title={group.name}
                update="Today"
                groupId={group.id}
            />
        {/each}
        <button class="btn create" on:click={() => (createGroupActive = true)}>
            <i class="material-symbols-outlined">add</i>
            <p>Create a new group</p>
        </button>
        <button class="btn join" on:click={() => alert(2)}>
            <i class="material-symbols-outlined">add</i>
            <p>Join a group</p>
        </button>
    </div>
</section>

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

    .search {
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        box-sizing: border-box;
        width: 100%;
        height: 1.75rem;
        padding: 0.25rem;
    }

    .groups {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 1.5rem;
        width: 100%;
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

    /* Elements */
    .create > p {
        color: var(--color-primary-black);
    }

    .create > i {
        color: var(--color-primary-black);
    }
</style>

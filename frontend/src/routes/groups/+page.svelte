<script lang="ts">
    import { GroupElement, CreateGroup, JoinGroup, Message } from "$components";
    import type { MessageContent } from "$interfaces/components";
    import type { GroupDetails } from "$interfaces/models";
    import { createGroup, getGroups } from "$scripts/api";
    import { onDestroy, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        createSearchStore,
        searchHandler,
        type SearchStoreModel,
    } from "$stores/search";

    /* Variables */
    let createGroupActive: boolean = false;
    let joinGroupActive: boolean = false;

    /* API Responses */
    let groupDetails: GroupDetails[];

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

    const joinGroup = (invite_id: string) => {
        if (!invite_id) {
            joinGroupActive = false;
            return;
        }

        // SEND API REQUEST
        joinGroupActive = false;

        console.log("join group with following invite id:");
        console.log(invite_id);
    };

    /* Search Stores */
    let searchStore: ReturnType<typeof createSearchStore>;
    let unsubscribe: () => void;

    onMount(async () => {
        await getGroups()
            .then((response) => {
                groupDetails = response;
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

        const searchGroups: GroupDetails[] = groupDetails.map((group) => ({
            ...group,
            searchTerms: `${group.name}`,
        }));

        searchStore = createSearchStore(searchGroups);
        unsubscribe = searchStore.subscribe(
            (model: SearchStoreModel<Record<PropertyKey, any>>) =>
                searchHandler(model),
        );
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });
</script>

<svelte:head>
    <title>Groups</title>
</svelte:head>

<section>
    <div class="header">
        <h1>My Groups</h1>
    </div>
    {#if groupDetails && searchStore}
        <input
            type="text"
            class="search"
            placeholder=" Search"
            bind:value={$searchStore.search}
        />
        <div class="groups">
            {#each $searchStore.filtered as group}
                <GroupElement title={group.name} groupId={group.id} />
            {/each}
            <button
                class="btn create"
                on:click={() => (createGroupActive = true)}
            >
                <i class="material-symbols-outlined">add</i>
                <p>Create a new group</p>
            </button>
            <button class="btn join" on:click={() => (joinGroupActive = true)}>
                <i class="material-symbols-outlined">add</i>
                <p>Join a group</p>
            </button>
        </div>
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

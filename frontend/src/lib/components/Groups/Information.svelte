<script lang="ts">
    import type { GroupDetails, UserDetails } from "$lib/interfaces/models";
    import { AddUsers } from "$components";

    export let submitChanges;
    export let removeUser;

    export let groupDetails: GroupDetails;
    export let groupUsers: UserDetails[];

    let search: string;
    let addMode: boolean;
    let editMode: boolean;
    let name: string = groupDetails.name;
    let owner: number = groupDetails.ownerId;

    $: if (!editMode) addMode = false;

    const handleSubmit = () => {
        const groupChanges: GroupDetails = {
            id: groupDetails.id,
            name: name,
            ownerId: owner,
        };

        submitChanges(groupChanges);
        editMode = false;
    };

    const closeAdd = () => {
        addMode = false;
    };
</script>

{#if addMode}
    <AddUsers
        {closeAdd}
        linkValue="https://questapp.com/invite/aca7a1c9-b691-480f-9511-edf45d932e11"
    />
{/if}
<div class="information">
    {#if !editMode}
        <div class="container header">
            <h2>Information</h2>
            <button on:click={() => (editMode = true)}>
                <i class="material-symbols-outlined">edit</i>
            </button>
        </div>
        <div class="container content">
            <p><strong>Name:</strong> {groupDetails.name}</p>
            <p><strong>Owner:</strong> {groupDetails.owner}</p>
            <p><strong>Participants:</strong></p>
            <div class="participants">
                {#each groupUsers as user}
                    <div class="user">
                        <img
                            src="https://picsum.photos/seed/test{user.name}/100"
                            alt=""
                        />
                        <p>{user.name}</p>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="container header">
            <h2>Information</h2>
            <button on:click={() => handleSubmit()}>
                <i class="material-symbols-outlined">save</i>
            </button>
        </div>
        <div class="container content">
            <div class="input">
                <p><strong>Name:</strong></p>
                <input type="text" bind:value={name} />
            </div>
            <div class="input">
                <p><strong>Owner:</strong></p>
                <select bind:value={owner}>
                    {#each groupUsers as user}
                        <option value={user.id}>{user.name}</option>
                    {/each}
                </select>
            </div>
            <div class="input">
                <p><strong>Participants:</strong></p>
            </div>
            <input
                type="text"
                class="search"
                placeholder="Search"
                bind:value={search}
            />
            <div class="participants">
                {#each groupUsers as user}
                    <div class="user">
                        <img
                            src="https://picsum.photos/seed/test{user.name}/100"
                            alt=""
                        />
                        <p>{user.name}</p>
                        <div class="overlay">
                            <button
                                class="delete material-symbols-outlined"
                                on:click={() => removeUser(user)}
                            >
                                delete
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
            <button class="add" on:click={() => (addMode = true)}
                ><strong>Add user</strong></button
            >
        </div>
    {/if}
</div>

<style>
    /* Sections */
    .information {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.125rem;
    }

    .container {
        background-color: var(--color-bg-2);

        height: auto;
        width: 100%;
        padding: 0.5rem 1rem 0.5rem 1rem;
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.75rem;
    }

    .header {
        flex-direction: row;
        align-items: center;
    }

    .participants {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: start;
        align-content: stretch;
        justify-content: space-around;
    }

    .user {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: stretch;
        justify-content: center;
        gap: 0.75rem;
    }

    .input {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 1rem;
    }

    .overlay {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.75);
        margin: 0;
        width: 6rem;
        height: 6rem;
        transform: translate(0, -1.0625rem);

        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: center;
    }

    /* Elements */
    p {
        font-size: 1.125rem;
        width: 100%;
    }

    h2 {
        flex: 1;
        flex-shrink: 0;
    }

    button {
        cursor: pointer;
        background: none;
        flex-shrink: 0;
        padding: 0;
        max-height: 1.5rem;
        max-width: 1.5rem;
    }

    i {
        width: auto;
        font-size: 1.5rem;
    }

    img {
        width: 6rem;
        height: 6rem;
        object-fit: cover;
    }

    input,
    select {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        width: 100%;
    }

    .search {
        box-sizing: border-box;
        width: 100%;
    }

    .delete {
        background: none;
        transition: 200ms background;
        border-radius: 50%;
        max-width: none;
        max-height: none;
        width: 2.5rem;
        height: 2.5rem;
        padding: 0.25rem;
    }

    .delete:hover {
        background-color: var(--color-primary-black);
    }

    .user > p {
        text-align: center;
        font-size: 1rem;
    }

    .input > p {
        width: auto;
    }

    .add {
        background-color: var(--color-accent-yellow);
        color: var(--color-primary-black);
        font-size: 1rem;
        padding: 0.5rem 1rem 0.5rem 1rem;
        max-width: none;
        max-height: none;
        width: 100%;
        height: auto;
        box-sizing: border-box;
    }
</style>

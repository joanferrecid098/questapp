<script lang="ts">
    import type { GroupDetails, UserDetails } from "$lib/interfaces/models";

    export let submitChanges;
    export let removeUser;
    export let addUser;

    export let groupDetails: GroupDetails;
    export let groupUsers: UserDetails[];
    export let editMode: boolean;

    let name: string = groupDetails.name;
    let owner: number = groupDetails.ownerId;

    const handleSubmit = () => {
        const groupChanges: GroupDetails = {
            id: groupDetails.id,
            name: name,
            ownerId: owner,
        };

        submitChanges(groupChanges);
        editMode = false;
    };
</script>

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
        margin-bottom: 1rem;
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
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
    }

    .user > p {
        text-align: center;
        font-size: 1rem;
    }

    .input > p {
        width: auto;
    }
</style>

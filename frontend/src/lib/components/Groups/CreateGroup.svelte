<script lang="ts">
    import { type UserDetails } from "$lib/interfaces/models";

    export let saveGroup;

    let groupUsers: UserDetails[] = [];
    let name: string;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="overlay" on:click={() => saveGroup()}></div>
<div class="create">
    <div class="container header">
        <h2>Create a new group</h2>
        <button on:click={() => saveGroup({ name }, groupUsers)}>
            <i class="material-symbols-outlined">save</i>
        </button>
    </div>
    <div class="container content">
        <div class="input">
            <p><strong>Name:</strong></p>
            <input type="text" placeholder="Group's name" bind:value={name} />
        </div>
        <div class="input">
            <p><strong>Participants:</strong></p>
        </div>
        <input type="text" class="search" placeholder="Search" />
        <div class="participants">
            {#each groupUsers as user}
                <div class="user">
                    <img
                        src="https://picsum.photos/seed/test{user.name}/100"
                        alt=""
                    />
                    <p>{user.name}</p>
                    <div class="overlay">
                        <button class="delete material-symbols-outlined">
                            delete
                        </button>
                    </div>
                </div>
            {/each}
        </div>
        <button class="add" on:click={() => alert(3)}
            ><strong>Add user</strong></button
        >
    </div>
</div>

<style>
    /* Sections */
    .create {
        position: absolute;
        width: 75%;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.125rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--color-bg-1);
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

    .overlay {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    .header {
        flex-direction: row;
        align-items: center;
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

    /* Elements */
    h2 {
        flex: 1;
    }

    input {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        width: 100%;
    }

    button {
        cursor: pointer;
        background: none;
        flex-shrink: 0;
        padding: 0;
        max-height: 1.5rem;
        max-width: 1.5rem;
    }

    .search {
        box-sizing: border-box;
        width: 100%;
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

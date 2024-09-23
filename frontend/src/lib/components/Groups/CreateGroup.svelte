<script lang="ts">
    import type { UserDetails } from "$lib/interfaces/models";
    import { Popup } from "$components";

    export let saveGroup;

    let name: string;
</script>

<Popup closeMethod={saveGroup}>
    <div class="container header">
        <h2>Create a new group</h2>
        <button on:click={() => saveGroup({ name })}>
            <i class="material-symbols-outlined">save</i>
        </button>
    </div>
    <div class="container content">
        <div class="input">
            <p><strong>Name:</strong></p>
            <input type="text" placeholder="Group's name" bind:value={name} />
        </div>
    </div>
</Popup>

<style>
    /* Sections */
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

    .input {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 1rem;
        margin-bottom: 0.125rem;
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
</style>

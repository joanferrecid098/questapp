<script lang="ts">
    import { AddUsers } from "$components";

    let addMode: boolean;

    const closeAdd = () => {
        addMode = false;
    };
</script>

<div class="information">
    <div class="container header">
        <h2>Information</h2>
    </div>
    <div class="container content">
        <p>There are currently no people in your group.</p>
        <button class="add" on:click={() => (addMode = true)}
            ><strong>Add user</strong></button
        >
    </div>
</div>
{#if addMode}
    <AddUsers
        {closeAdd}
        linkValue="https://questapp.com/invite/aca7a1c9-b691-480f-9511-edf45d932e11"
    />
{/if}

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

    .content {
        gap: 1.5rem;
    }

    /* Elements */
    p {
        font-style: italic;
    }

    button {
        cursor: pointer;
        background: none;
        flex-shrink: 0;
        padding: 0;
        max-height: 1.5rem;
        max-width: 1.5rem;
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

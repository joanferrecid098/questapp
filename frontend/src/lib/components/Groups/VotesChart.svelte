<script lang="ts">
    import { LoadingBar } from "$components";

    export let groupUsers;
</script>

<div class="votes">
    <div class="container">
        <h2>Votes</h2>
    </div>
    <div class="container content">
        {#each groupUsers as user}
            <div class="element">
                <p class="name">{user.name}</p>
                <LoadingBar progress={user.percentage} />
                <p class="percentage"><strong>{user.percentage}%</strong></p>
            </div>
        {/each}
    </div>
</div>

<style>
    /* Sections */
    .votes {
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

    .element {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 1rem;
    }

    /* Elements */
    p {
        font-size: 1rem;
        flex-shrink: 0;
    }

    .name {
        text-align: start;
        min-width: 4rem;
    }

    .percentage {
        text-align: end;
        min-width: 3rem;
    }
</style>

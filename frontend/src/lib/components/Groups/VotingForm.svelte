<script lang="ts">
    let selectedUser = new Number();
    export let groupUsers;
    export let submitVote;
</script>

<div class="voting">
    <div class="container">
        <h2>Voting</h2>
    </div>
    <div class="container content">
        <p>Who do you want to vote?</p>
        <div class="options">
            {#each groupUsers as user}
                {#if selectedUser.toString() === user.id}
                    <button on:click={() => (selectedUser = user.id)}
                        ><strong>{user.name}</strong></button
                    >
                {:else}
                    <button on:click={() => (selectedUser = user.id)}
                        >{user.name}</button
                    >
                {/if}
            {/each}
        </div>
        <div class="options">
            <button class="submit" on:click={submitVote(selectedUser)}
                ><strong>Submit</strong></button
            >
        </div>
    </div>
</div>

<style>
    /* Sections */
    .voting {
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
        gap: 0.5rem;
    }

    .options {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: start;
        align-content: stretch;
        justify-content: space-around;
        gap: 0.75rem;
    }

    /* Elements */
    button {
        background-color: var(--color-primary-black);
        font-size: 1rem;
        cursor: pointer;
        height: auto;
        width: auto;
        padding: 0.5rem 0.75rem;
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: center;
        gap: 0.75rem;
    }

    .submit {
        margin-bottom: 0.5rem;
        background-color: var(--color-accent-yellow);
        color: var(--color-primary-black);
    }
</style>

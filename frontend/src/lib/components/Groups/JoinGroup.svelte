<script lang="ts">
    import { Popup } from "$components";

    export let joinGroup;

    let invite_id: string;
    let errorMessage = false;

    $: errorMessage = !testIdRegex(invite_id);

    const testIdRegex = (invite_id: string) => {
        const regexCheck = new RegExp(
            "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}",
        );

        if (!invite_id) {
            return true;
        } else if (regexCheck.test(invite_id)) {
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (testIdRegex(invite_id)) {
            await joinGroup(invite_id);
        } else {
            errorMessage = true;
        }
    };
</script>

<Popup closeMethod={joinGroup}>
    <div class="container header">
        <h2>Join a group</h2>
        <button on:click={() => handleSubmit()}>
            <i class="material-symbols-outlined">send</i>
        </button>
    </div>
    <div class="container">
        <p>Specify the invite ID sent to you by the group owner:</p>
        <div class="input">
            <input type="text" placeholder="Invite ID" bind:value={invite_id} />
        </div>
        {#if errorMessage}
            <p class="error">The ID isn't valid.</p>
        {/if}
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

    button {
        cursor: pointer;
        background: none;
        flex-shrink: 0;
        padding: 0;
        max-height: 1.5rem;
        max-width: 1.5rem;
    }

    input {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        width: 100%;
    }

    .error {
        color: var(--color-danger-red);
    }

    /* Responsive */
    @media screen and (max-width: 800px) {
        h2 {
            font-size: 1.25rem;
        }
    }
</style>

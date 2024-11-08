<script lang="ts">
    import type { UserDetails } from "$interfaces/models";
    import { Popup } from "$components";

    export let userDetails: UserDetails;
    export let deleteAccount;

    let confirmText: string;
</script>

<Popup closeMethod={deleteAccount}>
    <div class="container header">
        <h2>Delete Account</h2>
    </div>
    <div class="container content">
        <p>
            Are you sure? This will permanently delete all information and
            groups you own. If you want to keep any of them, transfer the
            ownership in the settings page for the group.
        </p>
        <p>
            To delete your account, type "{userDetails.username}" in the
            following prompt.
        </p>
        <input
            type="text"
            bind:value={confirmText}
            placeholder={userDetails.username}
        />
        <button class="btn confirm" on:click={() => deleteAccount(confirmText)}>
            <i class="material-symbols-outlined">delete</i>
            <p>PERMANENTLY Delete Account</p>
        </button>
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

    .content {
        padding-bottom: 1rem;
    }

    .btn {
        cursor: pointer;
        width: 100%;
        padding: 0.625rem 1rem;
        box-sizing: border-box;

        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: center;
        gap: 0.75rem;
    }

    /* Elements */
    input {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        width: 100%;
    }

    .btn {
        font-size: 1rem;
    }

    .confirm {
        background-color: var(--color-danger-red);
    }

    /* Responsive */
    @media screen and (max-width: 800px) {
        h2 {
            font-size: 1.25rem;
        }
    }
</style>

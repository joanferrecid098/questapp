<script lang="ts">
    import { passwordStrength } from "check-password-strength";
    import { Popup } from "$components";

    export let updatePassword;

    let oldPassword: string;
    let newPassword: string;
    let errorMessage = false;

    $: strength = passwordStrength(newPassword);

    const handleSubmit = () => {
        if (
            strength.length >= 8 &&
            strength.contains.includes("number") &&
            strength.contains.includes("lowercase") &&
            strength.contains.includes("uppercase") &&
            strength.contains.includes("symbol")
        ) {
            updatePassword(oldPassword, newPassword);
            return;
        }

        errorMessage = true;
    };
</script>

<Popup closeMethod={updatePassword}>
    <div class="container header">
        <h2>Change Password</h2>
    </div>
    <div class="container content">
        <div class="input">
            <p><strong>Old password:</strong></p>
            <input type="password" bind:value={oldPassword} />
        </div>
        <div class="input">
            <p><strong>New password:</strong></p>
            <input type="password" bind:value={newPassword} />
        </div>
        <ul>
            <li class:valid={strength.length >= 8}>8 characters</li>
            <li class:valid={strength.contains.includes("number")}>1 number</li>
            <li class:valid={strength.contains.includes("lowercase")}>
                1 lowercase
            </li>
            <li class:valid={strength.contains.includes("uppercase")}>
                1 uppercase
            </li>
            <li class:valid={strength.contains.includes("symbol")}>1 symbol</li>
        </ul>
        {#if errorMessage}
            <p class="error">The required minimum conditions are not met.</p>
        {/if}
        <button class="btn change" on:click={handleSubmit}>
            <i class="material-symbols-outlined">password</i>
            <p>Change Password</p>
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

    .input {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 1rem;
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
    .input > p {
        flex-shrink: 0;
        font-size: 1.125rem;
    }

    .btn {
        font-size: 1rem;
    }

    .change {
        background-color: var(--color-accent-yellow);
        color: var(--color-primary-black);
    }

    ul {
        list-style-position: inside;
        list-style-type: disc;
        padding: 0;
        margin: 0;
    }

    li {
        color: var(--color-accent-yellow);
    }

    .valid {
        color: var(--color-text-white);
    }

    .error {
        color: var(--color-danger-red);
    }

    input {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        width: 100%;
    }

    /* Responsive */
    @media screen and (max-width: 800px) {
        h2 {
            font-size: 1.25rem;
        }

        .input {
            flex-direction: column;
            align-items: start;
            justify-content: start;
            gap: 0.75rem;
        }

        .input > p {
            font-size: 1rem;
        }
    }
</style>

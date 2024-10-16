<script lang="ts">
    import type { MessageContent } from "$interfaces/components";
    import { passwordStrength } from "check-password-strength";
    import { Message } from "$components";
    import { page } from "$app/stores";

    export let form;

    /* Variables */
    let signupMode = false;
    let password: string;

    /* Messages */
    let messageList: MessageContent[] = [];

    if (form) {
        messageList = [
            ...messageList,
            {
                title: "Error",
                content: form.error,
                type: "error",
            },
        ];
    }

    const closeDialogue = (messageContent: MessageContent) => {
        const index = messageList.indexOf(messageContent);

        if (index > -1) {
            messageList = [
                ...messageList.slice(0, index),
                ...messageList.slice(index + 1),
            ];
        }
    };

    /* Password Strength */
    $: strength = passwordStrength(password);
</script>

<section>
    {#if !signupMode}
        <div class="login">
            <div class="container header">
                <h2>Login</h2>
            </div>
            <form class="container" action="?/login" method="post">
                <div class="input">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required={true}
                    />
                </div>
                <div class="input">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required={true}
                    />
                </div>
                <button class="btn submit">
                    <i class="material-symbols-outlined">key</i>
                    <p>Login</p>
                </button>
            </form>
        </div>
        <button class="btn mode" on:click={() => (signupMode = true)}>
            <p>Create a new account</p>
        </button>
    {:else}
        <div class="login">
            <div class="container header">
                <h2>Sign up</h2>
            </div>
            <form class="container" action="?/register" method="post">
                <div class="input">
                    <input
                        type="text"
                        name="name"
                        placeholder="Display name"
                        required={true}
                    />
                </div>
                <div class="input">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required={true}
                    />
                </div>
                <div class="input">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required={true}
                        bind:value={password}
                    />
                </div>
                <ul>
                    <li class:valid={strength.length >= 8}>8 characters</li>
                    <li class:valid={strength.contains.includes("number")}>
                        1 number
                    </li>
                    <li class:valid={strength.contains.includes("lowercase")}>
                        1 lowercase
                    </li>
                    <li class:valid={strength.contains.includes("uppercase")}>
                        1 uppercase
                    </li>
                    <li class:valid={strength.contains.includes("symbol")}>
                        1 symbol
                    </li>
                </ul>
                <button class="btn submit">
                    <i class="material-symbols-outlined">key</i>
                    <p>Sign up</p>
                </button>
            </form>
        </div>
        <button class="btn mode" on:click={() => (signupMode = false)}>
            <p>Already have an account?</p>
        </button>
    {/if}
</section>
{#if messageList.length > 0}
    <div class="message-tray">
        {#each messageList as messageContent}
            <Message {messageContent} {closeDialogue} />
        {/each}
    </div>
{/if}

<style>
    /* Sections */
    section {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.5rem;
        width: 100%;
        height: 100%;
    }

    .header {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 2rem;
    }

    .login {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.0625rem;
        width: 100%;
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

    .input {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 1rem;
    }

    input {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        width: 100%;
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

    .mode {
        background: none;
    }

    /* Elements */
    .btn {
        font-size: 1rem;
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

    .submit {
        background-color: var(--color-accent-yellow);
        color: var(--color-primary-black);
    }

    i {
        width: auto;
        font-size: 1.5rem;
    }

    .mode > p {
        background-color: var(--color-primary-black);
        padding: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }
</style>

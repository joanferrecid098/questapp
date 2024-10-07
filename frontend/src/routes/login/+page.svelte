<script lang="ts">
    import type { MessageContent } from "$lib/interfaces/components";
    import { Message } from "$components";
    import { page } from "$app/stores";

    let messageList: MessageContent[] = [];

    if ($page.url.searchParams.has("invalid-creds")) {
        messageList.push({
            title: "Error",
            content: "Incorrect username or password",
        });
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
</script>

<section>
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
        gap: 1.5rem;
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

    .message-tray {
        position: fixed;
        top: 95%;
        left: 97.5%;
        transform: translate(-100%, -100%);
        min-width: 18rem;

        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 1rem;
    }

    /* Elements */
    .btn {
        font-size: 1rem;
    }

    .submit {
        background-color: var(--color-accent-yellow);
        color: var(--color-primary-black);
    }

    i {
        width: auto;
        font-size: 1.5rem;
    }
</style>

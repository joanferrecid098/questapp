<script lang="ts">
    import type { MessageContent } from "$interfaces/components";

    export let messageContent: MessageContent;
    export let closeDialogue;
</script>

<section
    class:info={messageContent.type === "info"}
    class:error={messageContent.type === "error"}
>
    <div class="header">
        <h3>{messageContent.title}</h3>
        <button on:click={() => closeDialogue(messageContent)}>
            <i class="material-symbols-outlined">close</i>
        </button>
    </div>
    <div class="content"><p>{messageContent.content}</p></div>
</section>

<style>
    /* Sections */
    section {
        padding: 0.5rem 1rem 0.5rem 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
        background-color: var(--color-bg-2);
        box-shadow: 0rem 0.25rem 0rem var(--color-primary-black);
    }

    .header,
    .content {
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

    /* Elements */
    h3 {
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

    .info {
        border-top: 0.125rem var(--color-secondary-blue) solid;
    }

    .error {
        border-top: 0.125rem var(--color-danger-red) solid;
    }
</style>

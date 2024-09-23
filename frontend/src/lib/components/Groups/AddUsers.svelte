<script lang="ts">
    import { Popup } from "$components";

    export let linkId: string;
    export let closeAdd;

    let linkPrefix = "https://questapp.com/invite/";
    let linkValue = linkPrefix + linkId;
    let linkIconState = "link";

    let idValue = linkId;
    let idIconState = "pin";

    const copyLink = async () => {
        await navigator.clipboard.writeText(linkValue);

        let tempValue = linkValue;

        linkIconState = "check";
        linkValue = "Copied";

        setTimeout(() => {
            linkIconState = "link";
            linkValue = tempValue;
        }, 1000);
    };

    const copyId = async () => {
        await navigator.clipboard.writeText(linkId);

        let tempValue = linkId;

        idIconState = "check";
        idValue = "Copied";

        setTimeout(() => {
            idIconState = "pin";
            idValue = tempValue;
        }, 1000);
    };
</script>

<Popup closeMethod={closeAdd}>
    <div class="container header">
        <h2>Add Users</h2>
    </div>
    <div class="container content">
        <p>To add someone, send them the following link:</p>
        <button
            class="link"
            on:mouseenter={() => (linkIconState = "content_copy")}
            on:mouseleave={() => (linkIconState = "link")}
            on:click={() => copyLink()}
        >
            <i class="material-symbols-outlined">{linkIconState}</i>
            <p>
                {linkValue}
            </p>
        </button>
        <p>or let them join using the following invite ID:</p>
        <button
            class="link"
            on:mouseenter={() => (idIconState = "content_copy")}
            on:mouseleave={() => (idIconState = "pin")}
            on:click={() => copyId()}
        >
            <i class="material-symbols-outlined">{idIconState}</i>
            <p>
                {idValue}
            </p>
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

    .link {
        box-sizing: border-box;
        padding: 0.5rem;
        background-color: var(--color-primary-black);
        color: var(--color-text-white);
        width: 100%;
        cursor: pointer;

        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 0.5rem;
    }

    /* Elements */
    .link > p {
        font-size: 1rem;
    }

    i {
        font-size: 1.25rem;
    }
</style>

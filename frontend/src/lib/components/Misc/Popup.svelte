<script lang="ts">
    export let closeMethod;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="overlay" on:click={() => closeMethod()}></div>
<div class="contents">
    <slot />
</div>

<style>
    /* Sections */
    .contents {
        position: absolute;
        width: 75%;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.125rem;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--color-bg-1);
    }

    .overlay {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
</style>

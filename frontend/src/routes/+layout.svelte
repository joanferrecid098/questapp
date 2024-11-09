<script lang="ts">
    import Sidebar from "./Sidebar.svelte";
    import Navbar from "./Navbar.svelte";
    import { onMount } from "svelte";
    import "../app.css";

    let isMobile = false;

    onMount(() => {
        isMobile = window.screen.availWidth <= 800;
    });
</script>

<div class="app">
    {#if isMobile}
        <Navbar />
    {:else}
        <Sidebar />
    {/if}

    <main>
        <slot />
    </main>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        width: 100%;
        box-sizing: border-box;
        padding-left: 10rem;
        padding-right: 4rem;
        padding-top: 4rem;
        padding-bottom: 2rem;
    }

    @media screen and (max-width: 800px) {
        main {
            padding: 1.5rem;
            padding-bottom: 7.5rem;
        }
    }
</style>

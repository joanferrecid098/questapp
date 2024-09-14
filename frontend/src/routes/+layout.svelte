<script>
    import Navbar from "./Navbar.svelte";
    import "../app.css";
</script>

<div class="app">
    <Navbar />

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
        padding-left: 12rem;
        padding-right: 4rem;
        padding-top: 4rem;
    }
</style>

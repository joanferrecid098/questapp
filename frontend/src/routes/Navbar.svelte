<nav>
    <a class="container home" href="/">
        <i class="material-symbols-outlined">home</i>
        <p>Home</p>
    </a>
    <a class="container groups" href="/groups">
        <i class="material-symbols-outlined">forum</i>
        <p>Groups</p>
    </a>
    <div class="bottom">
        <a class="container settings" href="/settings">
            <i class="material-symbols-outlined">settings</i>
            <p>Settings</p>
        </a>
    </div>
</nav>

<style>
    nav {
        /* Background */
        background-color: var(--color-bg-2);

        /* Position */
        width: 6rem;
        height: 100vh;
        max-width: 6rem;
        max-height: 100vh;
        position: fixed;
        padding: 2rem 0 2rem 0;
        box-sizing: border-box;

        /* Flex */
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 1rem;
    }

    .container {
        background-color: var(--color-primary-black);

        width: 100%;
        padding: 0;
        max-width: 4.5rem;
        max-height: 4.5rem;
        flex: 1;
        border-radius: 0.5rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: stretch;
        justify-content: center;
        gap: 0.125rem;
    }

    .container:hover {
        cursor: pointer;
    }

    .bottom {
        height: 100%;
        width: 100%;
        max-height: 100%;
        max-width: 4.5rem;
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: end;
        align-content: stretch;
        justify-content: end;
    }

    p {
        font-size: 0.75rem;
    }

    i {
        font-size: 1.5rem;
    }
</style>

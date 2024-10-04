<script lang="ts">
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

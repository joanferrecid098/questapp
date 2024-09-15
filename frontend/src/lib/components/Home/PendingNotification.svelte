<script>
    export let title;
    export let update;
    export let notifications;
    export let groupId;
</script>

<a class="container" href="/groups/{groupId}">
    <i class="material-symbols-outlined">groups</i>
    <p class="title"><strong>{title}</strong></p>
    <p class="update">Last update: <strong>{update}</strong></p>
    <p class="notifications"><strong>{notifications}</strong></p>
    <i class="material-symbols-outlined">notifications</i>
</a>

<style>
    .container {
        background-color: var(--color-bg-2);

        height: auto;
        width: 100%;
        padding: 0.5rem 1rem 0.5rem 1rem;
        box-sizing: border-box;
        margin: 0;

        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: stretch;
        justify-content: start;
        gap: 0.75rem;
    }

    p {
        font-size: 1rem;
        flex: 1;
        flex-shrink: 0;
        text-align: start;
    }

    i {
        font-size: 1.375rem;
    }

    .update,
    .notifications {
        text-align: end;
    }
</style>

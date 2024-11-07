<script lang="ts">
    import { getLastUpdatedDate } from "$scripts/dates";

    export let title;
    export let last_updated;
    export let groupId;

    const updateString = getLastUpdatedDate(last_updated);
</script>

<a class="container" href="/groups/{groupId}">
    <i class="material-symbols-outlined">groups</i>
    <p class="title"><strong>{title}</strong></p>
    <p class="update">Last update: <strong>{updateString}</strong></p>
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
        overflow-wrap: anywhere;
    }

    i {
        font-size: 1.375rem;
    }
    /* Responsive */
    @media screen and (max-width: 800px) {
        .update {
            text-align: end;
        }
    }
</style>

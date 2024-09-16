<script lang="ts">
    export let progress = 0;
</script>

<progress max={100} value={progress}>{progress}</progress>

<style>
    /* Dimensions */
    progress {
        width: 100%;
        border: 0;
        height: 1rem;
    }

    /* Colors */
    progress::-webkit-progress-bar {
        background-color: var(--color-text-white);
    }

    progress::-webkit-progress-value {
        background-color: var(--color-secondary-blue);
    }

    progress {
        background-color: var(--color-text-white);
        color: var(--color-secondary-blue);
    }

    progress::-moz-progress-bar {
        background-color: var(--color-secondary-blue);
    }

    progress[value]::-webkit-progress-bar {
        background-color: var(--color-text-white);
    }

    progress[value]::-webkit-progress-value {
        background-color: var(--color-secondary-blue);
    }
</style>

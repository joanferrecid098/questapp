<script lang="ts">
    export let groupDetails;
    export let groupUsers;
</script>

<div class="information">
    <div class="container">
        <h2>Information</h2>
    </div>
    <div class="container content">
        <p><strong>Name:</strong> {groupDetails.name}</p>
        <p><strong>Owner:</strong> {groupDetails.owner}</p>
        <p><strong>Participants:</strong></p>
        <div class="participants">
            {#each groupUsers as user}
                <div class="user">
                    <img
                        src="https://picsum.photos/seed/test{user.name}/100"
                        alt=""
                    />
                    <p>{user.name}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    /* Sections */
    .information {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.125rem;
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
        gap: 0.75rem;
    }

    .participants {
        width: 100%;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: start;
        align-content: stretch;
        justify-content: space-around;
    }

    .user {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: stretch;
        justify-content: center;
        gap: 0.75rem;
    }

    /* Elements */
    p {
        font-size: 1.125rem;
        width: 100%;
    }

    img {
        width: 6rem;
        height: 6rem;
        object-fit: cover;
    }

    .user > p {
        text-align: center;
        font-size: 1rem;
    }
</style>

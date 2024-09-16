<script lang="ts">
    /* export let data;
    data.slug;
    */
    import { VotingForm } from "$components";

    let currentVote = 0;
    const groupDetails = {
        name: "Example Group",
        nextQuestion: "2024-09-24 11:00:55",
    };
    const groupUsers = [
        { name: "Lynda", id: "1" },
        { name: "Russell", id: "2" },
        { name: "James", id: "3" },
    ];

    const submitVote = (id: number) => {
        // SEND API REQUEST
        currentVote = id;
    };
</script>

<section>
    <div class="header">
        <div class="details">
            <p><strong>{groupDetails.name}</strong></p>
            <p class="end">
                New question in: <strong>{groupDetails.nextQuestion}</strong>
            </p>
        </div>
        <div class="question">
            <h2>Who would be more likely to become an Olympic athelete?</h2>
        </div>
    </div>
    {#if currentVote == 0}
        <VotingForm {groupUsers} {submitVote} />
    {/if}
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
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.125rem;
        box-sizing: border-box;
    }

    .details,
    .question {
        width: 100%;
        background-color: var(--color-bg-2);
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        padding: 0.5rem 1rem 0.5rem 1rem;
        box-sizing: border-box;
    }

    .question {
        align-items: center;
    }

    /* Elements */
    .end {
        text-align: end;
    }

    .details > p {
        font-size: 1.125rem;
        flex-shrink: 0;
        flex: 1;
    }

    .question > h2 {
        width: 100%;
        text-align: center;
    }
</style>

<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { VotingForm, VotesChart, Information } from "$components";
    import { convertDateToTimeLeft } from "$scripts/dates";
    import { onDestroy, onMount } from "svelte";

    /* Variables */
    // export let data;
    // data.slug;
    let interval: ReturnType<typeof setInterval>;
    let timer: string = "";
    let currentVote = 0;

    /* API Responses */
    const groupDetails = {
        name: "Example Group",
        owner: "Russell",
        nextQuestion: "2024-09-24 01:11:30",
    };
    const groupUsers = [
        { name: "Lynda", id: "1", percentage: "30" },
        { name: "Russell", id: "2", percentage: "50" },
        { name: "James", id: "3", percentage: "20" },
    ];

    /* API Requests */
    const submitVote = (id: number) => {
        // SEND API REQUEST
        currentVote = id;
    };

    /* Intervals */
    const resetInterval = () => {
        clearInterval(interval);
        interval = setInterval(() => {
            const timerObject = convertDateToTimeLeft(
                new Date(groupDetails.nextQuestion),
            );
            if (timerObject.hours != 0) {
                timer = `${timerObject.hoursString}:${timerObject.minutesString}:${timerObject.secondsString}`;
                return;
            }
            if (timerObject.minutes != 0) {
                timer = `${timerObject.minutesString}:${timerObject.secondsString}`;
                return;
            }
            if (timerObject.seconds != 0) {
                timer = `${timerObject.secondsString}s`;
                return;
            }
            invalidateAll();
            return;
        }, 1000);

        const timerObject = convertDateToTimeLeft(
            new Date(groupDetails.nextQuestion),
        );
        if (timerObject.hours != 0) {
            timer = `${timerObject.hoursString}:${timerObject.minutesString}:${timerObject.secondsString}`;
            return;
        }
        if (timerObject.minutes != 0) {
            timer = `${timerObject.minutesString}:${timerObject.secondsString}`;
            return;
        }
        if (timerObject.seconds != 0) {
            timer = `${timerObject.secondsString}s`;
            return;
        }
        invalidateAll();
        return;
    };

    onMount(() => {
        resetInterval();
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<section>
    <div class="header">
        <div class="details">
            <p><strong>{groupDetails.name}</strong></p>
            <p class="end">
                New question in: <strong>{timer}</strong>
            </p>
        </div>
        <div class="question">
            <h2>Who would be more likely to become an Olympic athelete?</h2>
        </div>
    </div>
    {#if currentVote == 0}
        <VotingForm {groupUsers} {submitVote} />
    {:else}
        <VotesChart {groupUsers} />
        <Information {groupUsers} {groupDetails} />
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

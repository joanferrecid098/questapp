<script lang="ts">
    import type { GroupDetails, UserDetails } from "$lib/interfaces/models";
    import { timeLeftToUTCMidnight } from "$scripts/dates";
    import { invalidateAll } from "$app/navigation";
    import { onDestroy, onMount } from "svelte";
    import { page } from "$app/stores";
    import {
        VotingForm,
        VotesChart,
        Information,
        EmptyGroup,
    } from "$components";
    import {
        getGroup,
        getGroupUsers,
        postVote,
        updateGroup,
    } from "$scripts/api";

    /* Variables */
    let slug = $page.params.slug;
    let interval: ReturnType<typeof setInterval>;
    let timer: string = "";
    let hasVoted = false;

    let removedUsers: UserDetails[] = [];

    /* API Responses */
    let groupDetails: GroupDetails;
    let groupUsers: UserDetails[];

    onMount(async () => {
        groupDetails = await getGroup(Number(slug));
        groupUsers = await getGroupUsers(Number(slug));
        hasVoted = groupDetails.hasVoted!;
    });

    /* API Requests */
    const submitVote = (id: number) => {
        const response = postVote(id, 1, groupDetails.id);

        hasVoted = true;
    };

    const submitChanges = (groupDetails: GroupDetails) => {
        const response = updateGroup(groupDetails, removedUsers);

        invalidateAll();
    };

    const removeUser = (userDetails: UserDetails) => {
        removedUsers.push(userDetails);
    };

    /* Intervals */
    const resetInterval = () => {
        clearInterval(interval);
        interval = setInterval(() => {
            const timerObject = timeLeftToUTCMidnight();
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

        const timerObject = timeLeftToUTCMidnight();
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
    {#if groupDetails}
        <div class="header">
            <div class="details">
                <p><strong>{groupDetails.name}</strong></p>
                <p class="end">
                    New question in: <strong>{timer}</strong>
                </p>
            </div>
            <div class="question">
                <h2>{groupDetails.question}</h2>
            </div>
        </div>
        {#if groupUsers}
            {#if groupUsers.length == 0}
                <EmptyGroup />
            {:else if !hasVoted}
                <VotingForm {groupUsers} {submitVote} />
            {:else}
                <VotesChart {groupUsers} />
                <Information
                    {groupUsers}
                    {groupDetails}
                    {submitChanges}
                    {removeUser}
                />
            {/if}
        {/if}
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

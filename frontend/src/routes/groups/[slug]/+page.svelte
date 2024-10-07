<script lang="ts">
    import type { GroupDetails, UserDetails } from "$interfaces/models";
    import type { MessageContent } from "$interfaces/components";
    import { timeLeftToUTCMidnight } from "$scripts/dates";
    import { onDestroy, onMount } from "svelte";
    import { page } from "$app/stores";
    import {
        VotingForm,
        VotesChart,
        Information,
        EmptyGroup,
        Message,
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

    /* Messages */
    let messageList: MessageContent[] = [];

    if ($page.url.searchParams.has("new-group")) {
        messageList = [
            ...messageList,
            {
                title: "Success",
                content: "Successfully created group.",
                type: "info",
            },
        ];
    }

    const closeDialogue = (messageContent: MessageContent) => {
        const index = messageList.indexOf(messageContent);

        if (index > -1) {
            messageList = [
                ...messageList.slice(0, index),
                ...messageList.slice(index + 1),
            ];
        }
    };

    /* API Requests */
    const submitVote = async (id: number) => {
        await postVote(id, groupDetails.id)
            .then((response) => {
                hasVoted = true;
            })
            .catch((error) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Error",
                        content: error.message,
                        type: "error",
                    },
                ];
            });
    };

    const submitChanges = async (groupDetails: GroupDetails) => {
        await updateGroup(groupDetails, removedUsers)
            .then((response) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Success",
                        content: "Successfully updated group.",
                        type: "info",
                    },
                ];

                window.location.reload();
            })
            .catch((error) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Error",
                        content: error.message,
                        type: "error",
                    },
                ];
            });
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
            window.location.reload();
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
        window.location.reload();
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
{#if messageList.length > 0}
    <div class="message-tray">
        {#each messageList as messageContent}
            <Message {messageContent} {closeDialogue} />
        {/each}
    </div>
{/if}

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

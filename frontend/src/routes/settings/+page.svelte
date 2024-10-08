<script lang="ts">
    import { ChangePassword, DeleteAccount, Message } from "$components";
    import type { MessageContent } from "$interfaces/components";
    import type { UserDetails } from "$interfaces/models";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import {
        changePassword,
        getUserInfo,
        removeAccount,
        patchUser,
    } from "$scripts/api";

    /* API Responses */
    let accountDetails: UserDetails;

    /* Variables */
    let editMode: boolean = false;
    let deleteMode: boolean = false;
    let passwordMode: boolean = false;
    let cachedName: string;
    let cachedUsername: string;

    onMount(async () => {
        await getUserInfo()
            .then((response) => {
                accountDetails = response;
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

        cachedName = accountDetails.name!;
        cachedUsername = accountDetails.username!;
    });

    /* Messages */
    let messageList: MessageContent[] = [];

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
    const updateAccount = async ({ id, name, username }: UserDetails) => {
        if (!name || !username) {
            editMode = false;
            console.log("Nothing changed.");

            cachedName = accountDetails.name!;
            cachedUsername = accountDetails.username!;

            return;
        }
        if (name === accountDetails.username || name === accountDetails.name) {
            editMode = false;
            console.log("Nothing changed.");

            cachedName = accountDetails.name!;
            cachedUsername = accountDetails.username!;

            return;
        }

        await patchUser({ id, name, username })
            .then((response) => {
                accountDetails.name = name;
                accountDetails.username = username;

                cachedName = accountDetails.name;
                cachedUsername = accountDetails.username;
                messageList = [
                    ...messageList,
                    {
                        title: "Success",
                        content: "Successfully updated account details.",
                        type: "info",
                    },
                ];
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

        editMode = false;
    };

    const updatePassword = async (oldPassword: string, newPassword: string) => {
        if (!oldPassword || !newPassword) {
            passwordMode = false;
            return;
        }

        await changePassword(oldPassword, newPassword)
            .then((response) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Success",
                        content: "Successfully changed account password.",
                        type: "info",
                    },
                ];
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

        passwordMode = false;
        editMode = false;
    };

    const deleteAccount = async (confirm: string) => {
        if (confirm != accountDetails.username) {
            deleteMode = false;
            return;
        }

        await removeAccount()
            .then((response) => {
                messageList = [
                    ...messageList,
                    {
                        title: "Success",
                        content: "Successfully removed account.",
                        type: "info",
                    },
                ];

                goto("/login");
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
</script>

<svelte:head>
    <title>Settings</title>
</svelte:head>

<section>
    <div class="header">
        <h1>Settings</h1>
    </div>
    {#if !editMode}
        <div class="details">
            <div class="container header">
                <h2>Account Details</h2>
                <button class="edit" on:click={() => (editMode = true)}>
                    <i class="material-symbols-outlined">edit</i>
                </button>
            </div>
            <div class="container">
                <div class="info">
                    <div class="text">
                        <p>
                            <strong>Display name:</strong>
                            {#if accountDetails}
                                {accountDetails.name}
                            {:else}
                                Loading...
                            {/if}
                        </p>
                        <p>
                            <strong>Username:</strong>
                            {#if accountDetails}
                                {accountDetails.username}
                            {:else}
                                Loading...
                            {/if}
                        </p>
                    </div>
                    <div class="image">
                        <img src="https://picsum.photos/256/256" alt="" />
                    </div>
                </div>
                <form action="?/logout" method="post">
                    <button class="btn logoff" type="submit">
                        <i class="material-symbols-outlined">logout</i>
                        <p>Log Off</p>
                    </button>
                </form>
            </div>
        </div>
    {:else}
        <div class="details">
            <div class="container header">
                <h2>Account Details</h2>
                <button
                    class="edit"
                    on:click={() =>
                        updateAccount({
                            id: accountDetails.id,
                            name: cachedName,
                            username: cachedUsername,
                        })}
                >
                    <i class="material-symbols-outlined">save</i>
                </button>
            </div>
            <div class="container">
                <div class="info">
                    <div class="text">
                        <div class="input">
                            <p><strong>Display name:</strong></p>
                            <input type="text" bind:value={cachedName} />
                        </div>
                        <div class="input">
                            <p><strong>Username:</strong></p>
                            <input type="text" bind:value={cachedUsername} />
                        </div>
                    </div>
                    <div class="image">
                        <img src="https://picsum.photos/256/256" alt="" />
                    </div>
                </div>
                <button
                    class="btn change"
                    on:click={() => (passwordMode = true)}
                >
                    <i class="material-symbols-outlined">password</i>
                    <p>Change Password</p>
                </button>
                <button class="btn delete" on:click={() => (deleteMode = true)}>
                    <i class="material-symbols-outlined">delete</i>
                    <p>Delete Account</p>
                </button>
            </div>
        </div>
    {/if}
    <div class="app-info">
        <div class="container">
            <h2>App Details</h2>
        </div>
        <div class="container">
            <p><strong>Version:</strong> 1.1.0</p>
        </div>
    </div>
</section>
{#if deleteMode}
    <DeleteAccount {deleteAccount} userDetails={accountDetails} />
{/if}
{#if passwordMode}
    <ChangePassword {updatePassword} />
{/if}
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
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 2rem;
    }

    .details {
        display: flex;
        flex-direction: column;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.0625rem;
        width: 100%;
    }

    .app-info {
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

    .header {
        flex-direction: row;
        align-items: center;
    }

    .info {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: start;
        align-content: stretch;
        justify-content: start;
        gap: 0.75rem;
    }

    .text {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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

    form {
        padding: 0;
        margin: 0;
        width: 100%;
    }

    /* Elements */
    h2 {
        flex: 1;
    }

    .btn {
        font-size: 1rem;
    }

    .logoff,
    .change {
        background-color: var(--color-accent-yellow);
        color: var(--color-primary-black);
    }

    .delete {
        background-color: var(--color-danger-red);
    }

    .edit {
        cursor: pointer;
        background: none;
        flex-shrink: 0;
        padding: 0;
        max-height: 1.5rem;
        max-width: 1.5rem;
    }

    i {
        width: auto;
        font-size: 1.5rem;
    }

    .text > p {
        font-size: 1.25rem;
    }

    .input > p {
        font-size: 1.25rem;
        flex-shrink: 0;
    }
</style>

<script lang="ts">
    import type { UserDetails } from "$lib/interfaces/models";
    import { Popup } from "$components";

    export let userDetails: UserDetails;
    export let deleteAccount;
</script>

<Popup closeMethod={deleteAccount}>
    <div class="container header">
        <h2>Delete Account</h2>
    </div>
    <div class="container content">
        <p>
            Are you sure? This will permanently delete all information and
            groups you own. If you want to keep any of them, transfer the
            ownership in the settings page for the group.
        </p>
        <p>
            To delete your account, type "{userDetails.username}" in the
            following prompt.
        </p>
        <input type="text" />
        <button class="btn delete" on:click={() => alert(2)}>
            <i class="material-symbols-outlined">delete</i>
            <p>Delete Account</p>
        </button>
    </div>
</Popup>

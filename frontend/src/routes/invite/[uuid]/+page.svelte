<script lang="ts">
    import { goto } from "$app/navigation";
    import { acceptInvite } from "$scripts/api";
    import { onMount } from "svelte";

    export let data;

    let uuid;

    onMount(async () => {
        uuid = data.uuid;

        await acceptInvite(uuid)
            .then((response) => {
                goto("/groups/" + response.groupId + "?join-group");
            })
            .catch((error) => {
                goto("/groups?invite-not-found");
            });
    });
</script>

import { sessionStore } from "$stores/auth";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
    if (data.token) {
        sessionStore.set(data.token);
    }
};

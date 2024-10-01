import type { RequestEvent } from "@sveltejs/kit";
import { get, writable } from "svelte/store";

type CallbackFunction = (arg: string) => string;

export const createAuthStore = (event: RequestEvent) => {
    const { cookies } = event;

    const authStore = writable<string>(cookies.get("token") || "");

    return {
        subscribe: authStore.subscribe,
        set: (token: string) => {
            cookies.set("token", token, { path: "/" });
            authStore.set(token);
        },
        update: (callback: CallbackFunction) => {
            const updatedStore = callback(get(authStore));

            cookies.set("token", updatedStore, { path: "/" });
            authStore.set(updatedStore);
        },
        clear: () => {
            cookies.delete("token", { path: "/" });
            authStore.set("");
        },
    };
};

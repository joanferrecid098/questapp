import { get, writable } from "svelte/store";

type CallbackFunction = (arg: string) => string;

export const createAuthStore = () => {
    const isBrowser = typeof window !== "undefined";
    const authStore = writable<string>(localStorage.getItem("token") || "");

    return {
        subscribe: authStore.subscribe,
        set: (token: string) => {
            isBrowser && localStorage.setItem("token", JSON.stringify(token));
            authStore.set(token);
        },
        update: (callback: CallbackFunction) => {
            const updatedStore = callback(get(authStore));

            isBrowser &&
                localStorage.setItem("token", JSON.stringify(updatedStore));
            authStore.set(updatedStore);
        },
        clear: () => {
            localStorage.removeItem("token");
            authStore.set("");
        },
    };
};

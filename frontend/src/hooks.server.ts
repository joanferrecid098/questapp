import { sessionStore } from "$stores/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session");

    if (token) {
        sessionStore.set(token);
    }

    return await resolve(event);
};

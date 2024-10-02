import { createAuthStore } from "$stores/auth";
import { redirect, type HandleFetch } from "@sveltejs/kit";

export const handle = async ({ event, resolve }) => {
    const authStore = createAuthStore(event);
    const unsubscribe = authStore.subscribe((token) => {
        event.locals.token = token;
    });

    if (event.locals.token === "" && !event.url.pathname.startsWith("/login")) {
        throw redirect(302, "/login");
    }

    return await resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
    if (event.locals.token && event.locals.token !== "") {
        request.headers.set("Authorization", "Bearer " + event.locals.token);
    }

    return fetch(request);
};

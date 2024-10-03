import { sessionStore } from "$stores/auth";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session");

    const unprotectedRoutes = ["/login", "/register"];

    if (token) {
        sessionStore.set(token);
    }

    if (
        (!token || token === "") &&
        !unprotectedRoutes.some((route) => route === event.url.pathname)
    ) {
        throw redirect(302, "/login");
    }

    return await resolve(event);
};

import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { sessionStore } from "$stores/auth";

export const prerender = false;

export const actions: Actions = {
    logout: async ({ cookies, request }) => {
        cookies.delete("session", { path: "/" });
        sessionStore.set("");

        throw redirect(303, "/login");
    },
};

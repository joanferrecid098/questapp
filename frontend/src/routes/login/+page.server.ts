import { sessionStore } from "$stores/auth";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");

        const response = "test-token-login";

        cookies.set("session", response, { path: "/" });
        sessionStore.set(response);

        throw redirect(303, "/");
    },
    register: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");

        const response = "test-token-register";

        cookies.set("session", response, { path: "/" });
        sessionStore.set(response);

        throw redirect(303, "/");
    },
};

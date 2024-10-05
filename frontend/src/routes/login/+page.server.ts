import { base } from "$scripts/api";
import { sessionStore } from "$stores/auth";
import { redirect, type Actions } from "@sveltejs/kit";

interface ServerResponse {
    username: string;
    token: string;
    error: string;
}

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");

        const body = {
            username,
            password,
        };

        const response = await fetch(`${base}/api/users/login`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const result: ServerResponse = await response.json();

        if (response.ok) {
            cookies.set("session", result.token, { path: "/" });
            sessionStore.set(result.token);
        } else {
            console.error(result.error);
            return;
        }

        throw redirect(303, "/");
    },
    register: async ({ cookies, request }) => {
        const data = await request.formData();
        const name = data.get("name");
        const username = data.get("username");
        const password = data.get("password");

        const body = {
            name,
            username,
            password,
        };

        const response = await fetch(`${base}/api/users/signup`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const result: ServerResponse = await response.json();

        if (response.ok) {
            cookies.set("session", result.token, { path: "/" });
            sessionStore.set(result.token);
        } else {
            console.error(result.error);
            return;
        }

        throw redirect(303, "/");
    },
};

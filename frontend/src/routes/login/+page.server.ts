import { base } from "$scripts/api";
import { sessionStore } from "$stores/auth";
import { fail, redirect, type Actions } from "@sveltejs/kit";

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
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const result: ServerResponse = await response.json();
        const isSecure = request.headers.get("x-forwarded-proto") === "https";

        if (response.ok) {
            cookies.set("session", result.token, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: isSecure,
            });
            sessionStore.set(result.token);
        } else {
            return fail(400, { error: result.error });
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
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const result: ServerResponse = await response.json();
        const isSecure = request.headers.get("x-forwarded-proto") === "https";

        if (response.ok) {
            cookies.set("session", result.token, {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: isSecure,
            });
            sessionStore.set(result.token);
        } else {
            return fail(400, { error: result.error });
        }

        throw redirect(303, "/");
    },
};

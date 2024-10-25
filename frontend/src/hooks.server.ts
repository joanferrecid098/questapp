import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { jwtDecode } from "jwt-decode";

interface SessionToken {
    exp: number;
}

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session");

    const unprotectedRoutes = ["/login", "/register"];

    if (token) {
        const isSecure =
            event.request.headers.get("x-forwarded-proto") === "https";

        try {
            const decodedToken: SessionToken = jwtDecode<SessionToken>(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp < currentTime) {
                event.cookies.delete("session", {
                    path: "/",
                    httpOnly: true,
                    sameSite: "lax",
                    secure: isSecure,
                });
                throw redirect(302, "/login?expired-token");
            }

            event.locals.token = token;
        } catch (error) {
            event.cookies.delete("session", {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
                secure: isSecure,
            });
            throw redirect(302, "/login?expired-token");
        }
    }

    if (
        (!token || token === "") &&
        !unprotectedRoutes.some((route) => route === event.url.pathname)
    ) {
        throw redirect(302, "/login");
    }

    return await resolve(event);
};

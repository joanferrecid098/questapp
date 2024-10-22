import { test, expect } from "@playwright/test";

let authorizationToken: string;
let groupId: number;
let userId: number;

/* Create Temporary Account */
test.beforeAll(async ({ request }) => {
    const response = await request.post("/api/users/signup", {
        data: {
            name: "API Users User",
            username: "apitests1",
            password: "TestPass1!@",
        },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.token).toBeTruthy();

    if (json.token) {
        authorizationToken = "Bearer " + json.token;
        return true;
    }

    return false;
});

test.describe("Test Users API", async () => {
    test.describe.configure({ mode: "serial" });

    test("POST Login", async ({ request }) => {
        await test.step("Login User", async () => {
            const response = await request.post("/api/users/login", {
                data: {
                    username: "apitests1",
                    password: "TestPass1!@",
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json.token).toBeTruthy();

            if (json.token) {
                authorizationToken = "Bearer " + json.token;
                return true;
            }

            return false;
        });
    });

    test("GET User Info", async ({ request }) => {
        await test.step("Get Information", async () => {
            const response = await request.get("/api/users/user", {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const [json] = await response.json();
            expect(json.name).toMatch("API Users User");
            expect(json.username).toMatch("apitests1");
            expect(json.id).toBeTruthy();

            if (json.id) {
                userId = json.id;
                return true;
            }

            return false;
        });
    });

    test("GET User Stats", async ({ request }) => {
        await test.step("Get Statistics", async () => {
            const response = await request.get("/api/users/stats", {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const [json] = await response.json();
            expect(json.streak).toEqual(0);
            expect(json.joined_groups).toEqual(0);
            expect(json.owned_groups).toEqual(0);
            expect(json.votes.voted_percentage).toEqual(0);
            expect(json.votes.all_votes).toEqual(0);
            expect(json.votes.user_votes).toEqual(0);
        });

        await test.step("Create Group", async () => {
            const response = await request.post("/api/groups", {
                data: {
                    name: "API Testing Group",
                },
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response).toBeTruthy();
            const json = await response.json();
            expect(json.insertId).toBeTruthy();

            if (json.insertId) {
                groupId = json.insertId;
                return true;
            }

            return false;
        });

        await test.step("Submit Vote", async () => {
            const response = await request.post("/api/votes", {
                data: {
                    to_id: userId,
                    group_id: groupId,
                },
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response).toBeTruthy();
            const json = await response.json();
            expect(json.insertId).toBeTruthy();

            if (json.insertId) {
                groupId = json.insertId;
                return true;
            }

            return false;
        });

        await test.step("Verify Statistics", async () => {
            const response = await request.get("/api/users/stats", {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const [json] = await response.json();
            expect(json.streak).toEqual(1);
            expect(json.joined_groups).toEqual(1);
            expect(json.owned_groups).toEqual(1);
            expect(json.votes.voted_percentage).toEqual(100);
            expect(json.votes.all_votes).toEqual(1);
            expect(json.votes.user_votes).toEqual(1);
        });
    });

    test("PATCH User", async ({ request }) => {
        await test.step("Update User", async () => {
            const response = await request.patch("/api/users/user", {
                data: {
                    name: "API Users Account",
                    username: "apitests2",
                },
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json.affectedRows).toEqual(1);
        });

        await test.step("Verify User", async () => {
            const response = await request.get("/api/users/user", {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const [json] = await response.json();
            expect(json.name).toMatch("API Users Account");
            expect(json.username).toMatch("apitests2");
        });
    });

    test("PATCH Password", async ({ request }) => {
        await test.step("Update Password", async () => {
            const response = await request.patch("/api/users/password", {
                data: {
                    old_password: "TestPass1!@",
                    new_password: "TestPass2!@",
                },
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
        });

        await test.step("Verify Password", async () => {
            const response = await request.post("/api/users/login", {
                data: {
                    username: "apitests1",
                    password: "TestPass1!@",
                },
            });

            expect(response.ok()).not.toBeTruthy();
        });
    });

    test("GET Notifications", async ({ request }) => {
        await test.step("Get Notifications", async () => {
            const response = await request.get("/api/users/notifications", {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(0);
        });
    });
});

/* Remove Temporary Account */
test.afterAll(async ({ request }) => {
    const response = await request.delete("/api/users/user", {
        headers: {
            Authorization: authorizationToken,
        },
    });

    expect(response.ok()).toBeTruthy();
    return true;
});

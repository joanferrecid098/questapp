import { test, expect } from "@playwright/test";

let authorizationToken: string;
let groupId: number;
let userId: number;

/* Create Temporary Account */
test.beforeAll(async ({ request }) => {
    const response = await request.post("/api/users/signup", {
        data: {
            name: "API Votes User",
            username: "apitests5",
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

    test("GET Votes", async ({ request }) => {
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

        await test.step("Get Group Votes", async () => {
            const response = await request.get(`/api/groups/users/${groupId}`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(1);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Votes User");
            expect(json[0].username).toMatch("apitests5");
            expect(json[0].voteCount).toEqual(0);
            expect(json[0].user_id).toBeTruthy();

            if (json[0].user_id) {
                userId = json[0].user_id;
                return true;
            }

            return false;
        });
    });

    test("POST Vote", async ({ request }) => {
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
        });

        await test.step("Verify Group Votes", async () => {
            const response = await request.get(`/api/groups/users/${groupId}`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(1);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Votes User");
            expect(json[0].username).toMatch("apitests5");
            expect(json[0].voteCount).toEqual(1);
            expect(json[0].user_id).toBeTruthy();

            if (json[0].user_id) {
                userId = json[0].user_id;
                return true;
            }

            return false;
        });
    });
});

/* Remove Temporary Account */
test.afterAll(async ({ request }) => {
    var response = await request.delete("/api/users/user", {
        headers: {
            Authorization: authorizationToken,
        },
    });

    expect(response.ok()).toBeTruthy();
});

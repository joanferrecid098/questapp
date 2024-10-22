import { test, expect } from "@playwright/test";

let authorizationToken1: string;
let authorizationToken2: string;
let invite_uuid: string;
let groupId: number;
let userId1: number;
let userId2: number;

/* Create Temporary Account */
test.beforeAll(async ({ request }) => {
    var response = await request.post("/api/users/signup", {
        data: {
            name: "API Votes User",
            username: "apitests5",
            password: "TestPass1!@",
        },
    });

    expect(response.ok()).toBeTruthy();
    var json = await response.json();
    expect(json.token).toBeTruthy();

    if (!json.token) {
        return false;
    }

    authorizationToken1 = "Bearer " + json.token;

    var response = await request.post("/api/users/signup", {
        data: {
            name: "API Votes User 2",
            username: "apitests6",
            password: "TestPass2!@",
        },
    });

    expect(response.ok()).toBeTruthy();
    var json = await response.json();
    expect(json.token).toBeTruthy();

    if (!json.token) {
        return false;
    }

    authorizationToken2 = "Bearer " + json.token;

    var response = await request.get("/api/users/user", {
        headers: {
            Authorization: authorizationToken2,
        },
    });

    expect(response.ok()).toBeTruthy();
    var [json] = await response.json();

    if (!json.id) {
        return false;
    }

    userId2 = json.id;

    return true;
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
                    Authorization: authorizationToken1,
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
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(1);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Votes User");
            expect(json[0].username).toMatch("apitests5");
            expect(json[0].vote_count).toEqual(0);
            expect(json[0].user_id).toBeTruthy();

            if (json[0].user_id) {
                userId1 = json[0].user_id;
                return true;
            }

            return false;
        });
    });

    test("POST Invites", async ({ request }) => {
        await test.step("Create Invite", async () => {
            const response = await request.post("/api/groups/invite", {
                data: {
                    group_id: groupId,
                },
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json.invite_uuid).toBeTruthy();

            if (json.invite_uuid) {
                invite_uuid = json.invite_uuid;
                return true;
            }

            return false;
        });

        await test.step("Join Invite", async () => {
            const response = await request.post(
                `/api/groups/invite/${invite_uuid}`,
                {
                    headers: {
                        Authorization: authorizationToken2,
                    },
                }
            );

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json.affectedRows).toEqual(1);
        });
    });

    test("POST Vote", async ({ request }) => {
        await test.step("Submit Vote", async () => {
            const response = await request.post("/api/votes", {
                data: {
                    to_id: userId2,
                    group_id: groupId,
                },
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response).toBeTruthy();
            const json = await response.json();
            expect(json.insertId).toBeTruthy();
        });

        await test.step("Verify Group Votes", async () => {
            const response = await request.get(`/api/groups/users/${groupId}`, {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(2);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Votes User");
            expect(json[0].username).toMatch("apitests5");
            expect(json[0].vote_count).toEqual(0);
            expect(json[0].user_id).toBeTruthy();

            expect(json[1].group_id).toEqual(groupId);
            expect(json[1].name).toMatch("API Votes User 2");
            expect(json[1].username).toMatch("apitests6");
            expect(json[1].vote_count).toEqual(1);
            expect(json[1].user_id).toBeTruthy();
        });

        await test.step("Submit Vote", async () => {
            const response = await request.post("/api/votes", {
                data: {
                    to_id: userId1,
                    group_id: groupId,
                },
                headers: {
                    Authorization: authorizationToken2,
                },
            });

            expect(response).toBeTruthy();
            const json = await response.json();
            expect(json.insertId).toBeTruthy();
        });

        await test.step("Verify Group Votes", async () => {
            const response = await request.get(`/api/groups/users/${groupId}`, {
                headers: {
                    Authorization: authorizationToken2,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(2);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Votes User");
            expect(json[0].username).toMatch("apitests5");
            expect(json[0].vote_count).toEqual(1);
            expect(json[0].user_id).toBeTruthy();

            expect(json[1].group_id).toEqual(groupId);
            expect(json[1].name).toMatch("API Votes User 2");
            expect(json[1].username).toMatch("apitests6");
            expect(json[1].vote_count).toEqual(1);
            expect(json[1].user_id).toBeTruthy();
        });
    });

    test("PATCH Vote", async ({ request }) => {
        await test.step("Update Vote", async () => {
            const response = await request.patch(`/api/votes/vote/${groupId}`, {
                data: {
                    to_id: userId1,
                },
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response).toBeTruthy();
            const json = await response.json();
            expect(json.affectedRows).toEqual(1);
        });

        await test.step("Verify Group Votes", async () => {
            const response = await request.get(`/api/groups/users/${groupId}`, {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(2);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Votes User");
            expect(json[0].username).toMatch("apitests5");
            expect(json[0].vote_count).toEqual(2);
            expect(json[0].user_id).toBeTruthy();

            expect(json[1].group_id).toEqual(groupId);
            expect(json[1].name).toMatch("API Votes User 2");
            expect(json[1].username).toMatch("apitests6");
            expect(json[1].vote_count).toEqual(0);
            expect(json[1].user_id).toBeTruthy();
        });
    });

    test("DELETE Vote", async ({ request }) => {
        await test.step("Remove Vote", async () => {
            const response = await request.delete(
                `/api/votes/vote/${groupId}`,
                {
                    headers: {
                        Authorization: authorizationToken1,
                    },
                }
            );

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json.affectedRows).toEqual(1);
        });

        await test.step("Verify Group Votes", async () => {
            const response = await request.get(`/api/groups/users/${groupId}`, {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(2);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Votes User");
            expect(json[0].username).toMatch("apitests5");
            expect(json[0].vote_count).toEqual(1);
            expect(json[0].user_id).toBeTruthy();

            expect(json[1].group_id).toEqual(groupId);
            expect(json[1].name).toMatch("API Votes User 2");
            expect(json[1].username).toMatch("apitests6");
            expect(json[1].vote_count).toEqual(0);
            expect(json[1].user_id).toBeTruthy();
        });
    });
});

/* Remove Temporary Account */
test.afterAll(async ({ request }) => {
    var response = await request.delete("/api/users/user", {
        headers: {
            Authorization: authorizationToken1,
        },
    });

    expect(response.ok()).toBeTruthy();

    var response = await request.delete("/api/users/user", {
        headers: {
            Authorization: authorizationToken2,
        },
    });

    expect(response.ok()).toBeTruthy();
});

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
            name: "API Groups User",
            username: "apitests3",
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
            name: "API Groups User 2",
            username: "apitests4",
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

test.describe("Test Groups API", async () => {
    test.describe.configure({ mode: "serial" });

    test("POST Group", async ({ request }) => {
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

        await test.step("Verify Group", async () => {
            const response = await request.get(`/api/groups/group/${groupId}`, {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response).toBeTruthy();
            const [json] = await response.json();
            expect(json.name).toMatch("API Testing Group");
            expect(json.owner).toMatch("API Groups User");
            expect(json.has_voted).not.toBeTruthy();
            expect(json.is_owner).toBeTruthy();
        });
    });

    test("GET Groups", async ({ request }) => {
        await test.step("Get Groups", async () => {
            const response = await request.get("/api/groups", {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(1);
            expect(json[0].name).toMatch("API Testing Group");
        });
    });

    test("GET Group Users", async ({ request }) => {
        await test.step("Get Users", async () => {
            const response = await request.get(`/api/groups/users/${groupId}`, {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(1);
            expect(json[0].group_id).toEqual(groupId);
            expect(json[0].name).toMatch("API Groups User");
            expect(json[0].username).toMatch("apitests3");
            expect(json[0].vote_count).toEqual(0);
            expect(json[0].user_id).toBeTruthy();

            if (json[0].user_id) {
                userId1 = json[0].user_id;
                return true;
            }

            return false;
        });
    });

    test("PATCH Group", async ({ request }) => {
        await test.step("Update Group", async () => {
            const response = await request.patch(
                `/api/groups/group/${groupId}`,
                {
                    data: {
                        name: "API Test Group",
                        owner: userId1,
                    },
                    headers: {
                        Authorization: authorizationToken1,
                    },
                }
            );

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json.affectedRows).toEqual(1);
        });

        await test.step("Verify Group", async () => {
            const response = await request.get(`/api/groups/group/${groupId}`, {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response).toBeTruthy();
            const [json] = await response.json();
            expect(json.name).toMatch("API Test Group");
            expect(json.owner).toMatch("API Groups User");
            expect(json.has_voted).not.toBeTruthy();
            expect(json.is_owner).toBeTruthy();
        });
    });

    test("GET Group Question", async ({ request }) => {
        const dateString = new Date().toISOString().split("T", 1)[0];

        await test.step("Get Question", async () => {
            const response = await request.get(
                `/api/groups/question/${groupId}`,
                {
                    data: {
                        date: dateString,
                    },
                    headers: {
                        Authorization: authorizationToken1,
                    },
                }
            );

            expect(response.ok()).toBeTruthy();
            const [json] = await response.json();
            expect(json.date).toContain(dateString);
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

    test("TEST Permissions Safety", async ({ request }) => {
        await test.step("Try Updating Group", async () => {
            const response = await request.patch(
                `/api/groups/group/${groupId}`,
                {
                    data: {
                        name: "API Test Group",
                        owner: userId2,
                    },
                    headers: {
                        Authorization: authorizationToken2,
                    },
                }
            );

            expect(response.ok()).not.toBeTruthy();
        });

        await test.step("Try Removing User", async () => {
            const response = await request.delete("/api/groups/users", {
                data: {
                    user_id: userId1,
                    group_id: groupId,
                },
                headers: {
                    Authorization: authorizationToken2,
                },
            });

            expect(response.ok()).not.toBeTruthy();
        });

        await test.step("Try Deleting Group", async () => {
            const response = await request.delete(
                `/api/groups/group/${groupId}`,
                {
                    headers: {
                        Authorization: authorizationToken2,
                    },
                }
            );

            expect(response.ok()).not.toBeTruthy();
        });
    });

    test("DELETE Group User", async ({ request }) => {
        await test.step("Remove User", async () => {
            const response = await request.delete("/api/groups/users", {
                data: {
                    user_id: userId2,
                    group_id: groupId,
                },
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json.affectedRows).toEqual(1);
        });

        await test.step("Verify Group", async () => {
            const response = await request.get(`/api/groups/group/${groupId}`, {
                headers: {
                    Authorization: authorizationToken2,
                },
            });

            expect(response.ok()).not.toBeTruthy();
        });
    });

    test("DELETE Group", async ({ request }) => {
        await test.step("Remove Group", async () => {
            const response = await request.delete(
                `/api/groups/group/${groupId}`,
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

        await test.step("Verify Group", async () => {
            const response = await request.get(`/api/groups/group/${groupId}`, {
                headers: {
                    Authorization: authorizationToken1,
                },
            });

            expect(response.ok()).not.toBeTruthy();
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
    return true;
});

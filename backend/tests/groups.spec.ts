import { test, expect } from "@playwright/test";

let authorizationToken: string;
let groupId: number;

/* Create Temporary Account */
test.beforeAll(async ({ request }) => {
    const response = await request.post("/api/users/signup", {
        data: {
            name: "API Groups User",
            username: "apitests2",
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

test.describe("Test Groups API", async () => {
    test.describe.configure({ mode: "serial" });

    test("POST Group", async ({ request }) => {
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

        await test.step("Verify Group", async () => {
            const response = await request.get(`/api/groups/group/${groupId}`, {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response).toBeTruthy();
            const [json] = await response.json();
            expect(json.name).toMatch("API Testing Group");
            expect(json.owner).toMatch("API Groups User");
            expect(json.hasVoted).not.toBeTruthy();
            expect(json.isOwner).toBeTruthy();
        });
    });

    test("GET Groups", async ({ request }) => {
        await test.step("Get Groups", async () => {
            const response = await request.get("/api/groups", {
                headers: {
                    Authorization: authorizationToken,
                },
            });

            expect(response.ok()).toBeTruthy();
            const json = await response.json();
            expect(json).toHaveLength(1);
            expect(json[0].name).toMatch("API Testing Group");
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
});

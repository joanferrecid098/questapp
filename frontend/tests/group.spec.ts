import { test, expect, type Cookie } from "@playwright/test";
import exp from "constants";

let cookies1: Cookie[];
let cookies2: Cookie[];
let inviteUrl: string;
let inviteId: string;
let groupUrl: string;

test.describe("Test Home UI", async () => {
    test.describe.configure({ mode: "serial" });

    test("Register First User", async ({ page, browserName }) => {
        await page.goto("/");
        expect(page.url()).toContain("/login");

        expect(
            page.getByRole("button", { name: "Create a new account" })
        ).toBeVisible();
        await page
            .getByRole("button", { name: "Create a new account" })
            .click();

        expect(page.getByPlaceholder("Display name")).toBeVisible();
        expect(page.getByPlaceholder("Username")).toBeVisible();
        expect(page.getByPlaceholder("Password")).toBeVisible();
        expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();

        await page.getByPlaceholder("Display name").fill("UI Group Account");
        await page.getByPlaceholder("Username").fill("uitests5" + browserName);
        await page.getByPlaceholder("Password").fill("TestPass1!@");
        await page.getByRole("button", { name: "Sign up" }).click();

        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        cookies1 = await page.context().cookies();
    });

    test("Register Second User", async ({ page, browserName }) => {
        await page.goto("/");
        expect(page.url()).toContain("/login");

        expect(
            page.getByRole("button", { name: "Create a new account" })
        ).toBeVisible();
        await page
            .getByRole("button", { name: "Create a new account" })
            .click();

        expect(page.getByPlaceholder("Display name")).toBeVisible();
        expect(page.getByPlaceholder("Username")).toBeVisible();
        expect(page.getByPlaceholder("Password")).toBeVisible();
        expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();

        await page.getByPlaceholder("Display name").fill("UI Group Account 2");
        await page.getByPlaceholder("Username").fill("uitests6" + browserName);
        await page.getByPlaceholder("Password").fill("TestPass1!@");
        await page.getByRole("button", { name: "Sign up" }).click();

        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        cookies2 = await page.context().cookies();
    });

    test("Create Group", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto("/groups");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(
            page.getByRole("heading", { name: "My Groups" })
        ).toBeVisible();
        await expect(page.getByPlaceholder(" Search")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Create a new group" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Join a group" })
        ).toBeVisible();
        await expect(
            page.getByRole("link", {
                name: "groups Test Group Groups Last update:",
            })
        ).not.toBeVisible();

        await page
            .getByRole("button", { name: "add Create a new group" })
            .click();

        await expect(page.getByText("Create a new group save")).toBeVisible();
        await expect(page.getByRole("button", { name: "save" })).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: "Name:" }).nth(3)
        ).toBeVisible();

        await page.getByPlaceholder("Group's name").fill("Test Group Groups");
        await page.getByRole("button", { name: "save" }).click();
        await page.waitForTimeout(2000);

        expect(page.url()).toContain("/group");
    });

    test("Expect Group", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto("/groups");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(
            page.getByRole("heading", { name: "My Groups" })
        ).toBeVisible();
        await expect(page.getByPlaceholder(" Search")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Create a new group" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Join a group" })
        ).toBeVisible();
        await expect(
            page.getByRole("link", {
                name: "groups Test Group Groups Last update:",
            })
        ).toBeVisible();

        await page.getByPlaceholder(" Search").fill("Gibberish");
        await expect(
            page.getByRole("link", {
                name: "groups Test Group Groups Last update:",
            })
        ).not.toBeVisible();

        await page.getByPlaceholder(" Search").fill("Test Group");
        await expect(
            page.getByRole("link", {
                name: "groups Test Group Groups Last update:",
            })
        ).toBeVisible();

        await page
            .getByRole("link", {
                name: "groups Test Group Groups Last update:",
            })
            .click();
        await page.waitForTimeout(1000);

        groupUrl = page.url();
    });

    test("Submit Vote", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto(groupUrl);
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await expect(
            page.getByRole("button", { name: "UI Group Account" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Submit" })
        ).toBeVisible();

        await page.getByRole("button", { name: "UI Group Account" }).click();
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(
            page.getByRole("heading", { name: "Information" })
        ).toBeVisible({ timeout: 2000 });
    });

    test("Update Group", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto(groupUrl);
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await expect(
            page.locator("p").filter({ hasText: /^Test Group Groups$/ })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Votes$/ })
        ).toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: "UI Group Account 100 100%" })
                .nth(3)
        ).toBeVisible();
        await expect(page.getByText("Information edit")).toBeVisible();

        await expect(page.getByText("Name: Test Group Groups")).toBeVisible();
        await expect(page.getByText("Owner: UI Group Account")).toBeVisible();
        await expect(
            page.locator("p").filter({ hasText: "Participants:" })
        ).toBeVisible();
        await expect(
            page
                .getByRole("main")
                .locator("div")
                .filter({ hasText: "Information edit Name: Test Group Groups" })
                .locator("div")
                .nth(3)
        ).toBeVisible();

        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(
            page.locator("div").filter({ hasText: "Name:" }).nth(4)
        ).toBeVisible();
        await expect(page.getByText("Owner: UI Group Account")).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Participants:$/ })
        ).toBeVisible();
        await expect(page.getByPlaceholder("Search")).toBeVisible();
        await expect(page.getByText("UI Group Account delete")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Add user" })
        ).toBeVisible();

        await page.getByRole("textbox").first().fill("Test Group Groups 2");
        await page.getByRole("button", { name: "save" }).click();
        await page.waitForTimeout(500);
    });

    test("Create Invite", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto(groupUrl);
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await page.getByRole("button", { name: "Add user" }).click();
        await page.waitForTimeout(500);

        await expect(
            page.locator("div").filter({ hasText: /^Add Users$/ })
        ).toBeVisible();
        await expect(
            page.getByText("To add someone, send them the")
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "link http://localhost:4173/" })
        ).toBeVisible();
        await expect(
            page.getByText("or let them join using the")
        ).toBeVisible();
        expect(page.getByRole("button", { name: "pin" })).toBeVisible();

        inviteUrl = (await page
            .getByRole("button", { name: "link http://localhost:4173/" })
            .textContent())!.split(" ")[1];

        await page.reload();
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await page.getByRole("button", { name: "Add user" }).click();
        await page.waitForTimeout(500);

        await expect(
            page.locator("div").filter({ hasText: /^Add Users$/ })
        ).toBeVisible();
        await expect(
            page.getByText("To add someone, send them the")
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "link http://localhost:4173/" })
        ).toBeVisible();
        await expect(
            page.getByText("or let them join using the")
        ).toBeVisible();
        expect(page.getByRole("button", { name: "pin" })).toBeVisible();

        inviteId = (await page
            .getByRole("button", { name: "pin" })
            .textContent())!.split(" ")[1];
    });

    test("Join Group URL", async ({ page }) => {
        await page.context().addCookies(cookies2);

        await page.goto(inviteUrl);
        await page.waitForTimeout(2000);

        expect(page.url()).toContain("/group");

        await expect(
            page.getByRole("button", { name: "UI Group Account", exact: true })
        ).toBeVisible();
        await expect(
            page.getByRole("button", {
                name: "UI Group Account 2",
                exact: true,
            })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Submit" })
        ).toBeVisible();

        await page.getByRole("button", { name: "UI Group Account 2" }).click();
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(
            page.getByRole("heading", { name: "Information" })
        ).toBeVisible({ timeout: 2000 });
    });

    test("Expect New User", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto(groupUrl);
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await expect(
            page.locator("p").filter({ hasText: /^Test Group Groups 2$/ })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Votes$/ })
        ).toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: "UI Group Account 50 50%" })
                .nth(3)
        ).toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: "UI Group Account 2 50 50%" })
                .nth(4)
        ).toBeVisible();
        await expect(page.getByText("Information edit")).toBeVisible();

        await expect(page.getByText("Name: Test Group Groups 2")).toBeVisible();
        await expect(page.getByText("Owner: UI Group Account")).toBeVisible();
        await expect(
            page.locator("p").filter({ hasText: "Participants:" })
        ).toBeVisible();
        await expect(
            page.getByText("UI Group Account", { exact: true }).last()
        ).toBeVisible();
        await expect(
            page.getByText("UI Group Account 2", { exact: true }).last()
        ).toBeVisible();
    });

    test("Delete User", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto(groupUrl);
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await expect(
            page.locator("p").filter({ hasText: /^Test Group Groups 2$/ })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Votes$/ })
        ).toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: "UI Group Account 50 50%" })
                .nth(3)
        ).toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: "UI Group Account 2 50 50%" })
                .nth(4)
        ).toBeVisible();
        await expect(page.getByText("Information edit")).toBeVisible();

        await expect(page.getByText("Name: Test Group Groups 2")).toBeVisible();
        await expect(page.getByText("Owner: UI Group Account")).toBeVisible();
        await expect(
            page.locator("p").filter({ hasText: "Participants:" })
        ).toBeVisible();
        await expect(
            page.getByText("UI Group Account", { exact: true }).last()
        ).toBeVisible();
        await expect(
            page.getByText("UI Group Account 2", { exact: true }).last()
        ).toBeVisible();

        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(
            page.locator("div").filter({ hasText: /^Participants:$/ })
        ).toBeVisible();
        await expect(page.getByPlaceholder("Search")).toBeVisible();
        await expect(page.getByText("UI Group Account delete")).toBeVisible();
        await expect(page.getByText("UI Group Account 2 delete")).toBeVisible();

        await page.getByPlaceholder("Search").fill("Gibberish");
        await expect(
            page.getByText("UI Group Account delete")
        ).not.toBeVisible();
        await expect(
            page.getByText("UI Group Account 2 delete")
        ).not.toBeVisible();

        await page.getByPlaceholder("Search").fill("UI Group Account");
        await expect(page.getByText("UI Group Account delete")).toBeVisible();
        await expect(page.getByText("UI Group Account 2 delete")).toBeVisible();

        await page.getByPlaceholder("Search").fill("UI Group Account 2");
        await expect(
            page.getByText("UI Group Account delete")
        ).not.toBeVisible();
        await expect(page.getByText("UI Group Account 2 delete")).toBeVisible();

        await page.getByRole("button", { name: "delete" }).click();
        await page.getByRole("button", { name: "save" }).click();

        await page.waitForTimeout(1000);
        await expect(
            page.getByText("UI Group Account", { exact: true }).last()
        ).toBeVisible();
        await expect(
            page.getByText("UI Group Account 2", { exact: true }).last()
        ).not.toBeVisible();
    });

    test("Join Group ID", async ({ page }) => {
        await page.context().addCookies(cookies2);

        await page.goto("/groups");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(
            page.getByRole("heading", { name: "My Groups" })
        ).toBeVisible();
        await expect(page.getByPlaceholder(" Search")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Create a new group" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Join a group" })
        ).toBeVisible();
        await expect(
            page.getByRole("link", {
                name: "groups Test Group Groups 2 Last update:",
            })
        ).not.toBeVisible();

        await page.getByRole("button", { name: "add Join a group" }).click();
        await page.waitForTimeout(500);

        await expect(page.getByText("Join a group send")).toBeVisible();
        await expect(
            page.getByText("Specify the invite ID sent to")
        ).toBeVisible();
        await expect(page.getByPlaceholder("Invite ID")).toBeVisible();

        await page.getByPlaceholder("Invite ID").fill(inviteId);
        await page.getByRole("button", { name: "send" }).click();
        await page.waitForTimeout(2000);

        expect(page.url()).toContain("/group");

        await expect(
            page.locator("p").filter({ hasText: /^Test Group Groups 2$/ })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Votes$/ })
        ).toBeVisible();
    });

    test("Transfer Ownership", async ({ page }) => {
        await page.context().addCookies(cookies1);

        await page.goto(groupUrl);
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(page.getByText("Owner: UI Group Account")).toBeVisible();
        await page.getByRole("combobox").selectOption("UI Group Account 2");

        await page.getByRole("button", { name: "save" }).click();
        await page.waitForTimeout(1000);

        await expect(
            page.getByRole("button", { name: "edit" })
        ).not.toBeVisible();
    });
});

test.afterAll(async ({ request, browserName }) => {
    let authorizationToken: string;

    var response = await request.post("http://localhost:8080/api/users/login", {
        data: {
            username: "uitests5" + browserName,
            password: "TestPass1!@",
        },
    });

    expect(response.ok()).toBeTruthy();
    var json = await response.json();
    expect(json.token).toBeTruthy();

    authorizationToken = "Bearer " + json.token;

    var response = await request.delete(
        "http://localhost:8080/api/users/user",
        {
            headers: {
                Authorization: authorizationToken,
            },
        }
    );

    expect(response.ok()).toBeTruthy();

    var response = await request.post("http://localhost:8080/api/users/login", {
        data: {
            username: "uitests6" + browserName,
            password: "TestPass1!@",
        },
    });

    expect(response.ok()).toBeTruthy();
    var json = await response.json();
    expect(json.token).toBeTruthy();

    authorizationToken = "Bearer " + json.token;

    var response = await request.delete(
        "http://localhost:8080/api/users/user",
        {
            headers: {
                Authorization: authorizationToken,
            },
        }
    );

    expect(response.ok()).toBeTruthy();
    return true;
});

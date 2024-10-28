import { test, expect, type Cookie } from "@playwright/test";

let cookies: Cookie[];
let groupUrl: string;

test.describe("Test Home UI", async () => {
    test.describe.configure({ mode: "serial" });

    test("Register User", async ({ page, browserName }) => {
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

        await page.getByPlaceholder("Display name").fill("UI Login Account");
        await page.getByPlaceholder("Username").fill("uitests2" + browserName);
        await page.getByPlaceholder("Password").fill("TestPass1!@");
        await page.getByRole("button", { name: "Sign up" }).click();

        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        cookies = await page.context().cookies();
    });

    test("Expect New Account Home", async ({ page }) => {
        await page.context().addCookies(cookies);

        await page.goto("/");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(
            page.locator("div").filter({ hasText: /^Pending$/ })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^No new notifications$/ })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Create your first group" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Join a group" })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Statistics$/ })
        ).not.toBeVisible();
        await expect(
            page.getByText("How many times were you voted?")
        ).not.toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Information$/ })
        ).not.toBeVisible();
        await expect(page.getByText("Daily streak:")).not.toBeVisible();
    });

    test("Create Group", async ({ page }) => {
        await page.context().addCookies(cookies);

        await page.goto("/");
        expect(page.url()).not.toContain("/login");

        await page
            .getByRole("button", { name: "add Create your first group" })
            .click();

        await expect(page.getByText("Create a new group save")).toBeVisible();
        await expect(page.getByRole("button", { name: "save" })).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: "Name:" }).nth(3)
        ).toBeVisible();

        await page.getByPlaceholder("Group's name").fill("Test Group Home");
        await page.getByRole("button", { name: "save" }).click();
        await page.waitForTimeout(2000);

        expect(page.url()).toContain("/group");
        groupUrl = page.url();
    });

    test("Expect Updated Account Home", async ({ page }) => {
        await page.context().addCookies(cookies);

        await page.goto("/");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(
            page.locator("div").filter({ hasText: /^Pending$/ })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^No new notifications$/ })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Create your first group" })
        ).not.toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Join a group" })
        ).not.toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Statistics$/ })
        ).toBeVisible();
        await expect(
            page.getByText("How many times were you voted?")
        ).toBeVisible();
        await expect(page.getByText("0", { exact: true })).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Information$/ })
        ).toBeVisible();
        await expect(
            page.getByText("Groups you participate in: 1")
        ).toBeVisible();
        await expect(
            page.getByText("Groups you are the owner in: 1")
        ).toBeVisible();
        await expect(page.getByText("Daily streak: 0")).toBeVisible();
    });

    test("Submit Vote", async ({ page }) => {
        await page.context().addCookies(cookies);

        await page.goto(groupUrl);
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/group");

        await expect(
            page.getByRole("button", { name: "UI Login Account" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "Submit" })
        ).toBeVisible();

        await page.getByRole("button", { name: "UI Login Account" }).click();
        await page.getByRole("button", { name: "Submit" }).click();

        await expect(
            page.getByRole("heading", { name: "Information" })
        ).toBeVisible({ timeout: 2000 });
    });

    test("Expect Voted Account Home", async ({ page }) => {
        await page.context().addCookies(cookies);

        await page.goto("/");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(
            page.locator("div").filter({ hasText: /^Pending$/ })
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^No new notifications$/ })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Create your first group" })
        ).not.toBeVisible();
        await expect(
            page.getByRole("button", { name: "add Join a group" })
        ).not.toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Statistics$/ })
        ).toBeVisible();
        await expect(
            page.getByText("How many times were you voted?")
        ).toBeVisible();
        await expect(page.getByText("100", { exact: true })).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: /^Information$/ })
        ).toBeVisible();
        await expect(
            page.getByText("Groups you participate in: 1")
        ).toBeVisible();
        await expect(
            page.getByText("Groups you are the owner in: 1")
        ).toBeVisible();
        await expect(page.getByText("Daily streak: 1")).toBeVisible();
    });
});

test.afterAll(async ({ request, browserName }) => {
    let authorizationToken: string;

    var response = await request.post("http://localhost:8080/api/users/login", {
        data: {
            username: "uitests2" + browserName,
            password: "TestPass1!@",
        },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
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

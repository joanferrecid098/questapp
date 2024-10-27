import { test, expect } from "@playwright/test";

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

        expect(page.url()).not.toContain("/login");
    });

    test("Expect New Account Home", async ({ page }) => {
        // await page.goto("/");
        // expect(page.url()).not.toContain("/login");
        // expect(
        //     page.locator("div").filter({ hasText: /^Pending$/ })
        // ).toBeVisible();
        // expect(
        //     page.locator("div").filter({ hasText: /^No new notifications$/ })
        // ).toBeVisible();
        // expect(
        //     page.getByRole("button", { name: "add Create your first group" })
        // ).toBeVisible();
        // expect(
        //     page.getByRole("button", { name: "add Join a group" })
        // ).toBeVisible();
        // expect(
        //     page.locator("div").filter({ hasText: /^Statistics$/ })
        // ).not.toBeVisible();
        // expect(
        //     page.getByText("How many times were you voted?")
        // ).not.toBeVisible();
        // expect(
        //     page.locator("div").filter({ hasText: /^Information$/ })
        // ).not.toBeVisible();
        // expect(
        //     page.getByText("How many times were you voted?")
        // ).not.toBeVisible();
        // expect(page.getByText("Daily streak:")).not.toBeVisible();
    });
});

test.afterAll(async ({ request, browserName }) => {
    let authorizationToken: string;

    var response = await request.post("http://127.0.0.1:8080/api/users/login", {
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
        "http://127.0.0.1:8080/api/users/user",
        {
            headers: {
                Authorization: authorizationToken,
            },
        }
    );

    expect(response.ok()).toBeTruthy();
    return true;
});

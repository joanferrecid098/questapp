import { test, expect, type Cookie } from "@playwright/test";

let cookies: Cookie[];

test.describe("Test Settings UI", async () => {
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
        await page.getByPlaceholder("Username").fill("uitests3" + browserName);
        await page.getByPlaceholder("Password").fill("TestPass1!@");
        await page.getByRole("button", { name: "Sign up" }).click();

        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        cookies = await page.context().cookies();
    });

    test("Expect New Account Details", async ({ page, browserName }) => {
        await page.context().addCookies(cookies);

        await page.goto("/settings");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(page.getByText("Account Details edit")).toBeVisible();
        await expect(page.getByRole("button", { name: "edit" })).toBeVisible();
        await expect(
            page.getByText("Display name: UI Login Account")
        ).toBeVisible();
        await expect(
            page.getByText("Username: uitests3" + browserName)
        ).toBeVisible();
        await expect(page.locator("img")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "logout Log Off" })
        ).toBeVisible();

        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(page.getByRole("textbox").first()).toBeVisible();
        await expect(page.getByRole("textbox").nth(1)).toBeVisible();
        await expect(page.locator("img")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "password Change Password" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "delete Delete Account" })
        ).toBeVisible();
    });

    test("Change Account Details", async ({ page, browserName }) => {
        await page.context().addCookies(cookies);

        await page.goto("/settings");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(page.getByRole("button", { name: "edit" })).toBeVisible();
        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(page.getByRole("textbox").first()).toBeVisible();
        await expect(page.getByRole("textbox").nth(1)).toBeVisible();
        await expect(page.getByRole("button", { name: "save" })).toBeVisible();

        await page.getByRole("textbox").first().fill("UI Login Account 2");
        await page
            .getByRole("textbox")
            .nth(1)
            .fill("uitests4" + browserName);
        await page.getByRole("button", { name: "save" }).click();

        await page.waitForTimeout(2000);
    });

    test("Expect Updated Account Details", async ({ page, browserName }) => {
        await page.context().addCookies(cookies);

        await page.goto("/settings");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(page.getByText("Account Details edit")).toBeVisible();
        await expect(page.getByRole("button", { name: "edit" })).toBeVisible();
        await expect(
            page.getByText("Display name: UI Login Account 2")
        ).toBeVisible();
        await expect(
            page.getByText("Username: uitests4" + browserName)
        ).toBeVisible();
        await expect(page.locator("img")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "logout Log Off" })
        ).toBeVisible();

        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(page.getByRole("textbox").first()).toBeVisible();
        await expect(page.getByRole("textbox").nth(1)).toBeVisible();
        await expect(page.locator("img")).toBeVisible();
        await expect(
            page.getByRole("button", { name: "password Change Password" })
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "delete Delete Account" })
        ).toBeVisible();
    });
});

test.afterAll(async ({ request, browserName }) => {
    let authorizationToken: string;

    var response = await request.post("http://localhost:8080/api/users/login", {
        data: {
            username: "uitests4" + browserName,
            password: "TestPass1!@",
        },
    });

    if (!response.ok()) {
        var response = await request.post(
            "http://localhost:8080/api/users/login",
            {
                data: {
                    username: "uitests3" + browserName,
                    password: "TestPass1!@",
                },
            }
        );
    }

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

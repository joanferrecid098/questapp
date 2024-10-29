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

    test("Change Password", async ({ page }) => {
        await page.context().addCookies(cookies);

        await page.goto("/settings");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(page.getByRole("button", { name: "edit" })).toBeVisible();
        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(
            page.getByRole("button", { name: "password Change Password" })
        ).toBeVisible();
        await page
            .getByRole("button", { name: "password Change Password" })
            .click();
        await page.waitForTimeout(500);

        await expect(
            page.locator("div").filter({ hasText: "Old password:" }).nth(4)
        ).toBeVisible();
        await expect(
            page.locator("div").filter({ hasText: "New password:" }).nth(4)
        ).toBeVisible();
        await expect(
            page.getByRole("heading", { name: "Change Password" })
        ).toBeVisible();
        await expect(
            page
                .getByRole("main")
                .locator("div")
                .filter({ hasText: "Change Password Old password" })
                .getByRole("button")
        ).toBeVisible();
        await expect(page.getByText("The required minimum")).not.toBeVisible();

        await page.getByRole("textbox").nth(2).fill("TestPass1!@");
        await page.getByRole("textbox").nth(3).fill("TestPass");
        await page
            .getByRole("main")
            .locator("div")
            .filter({ hasText: "Change Password Old password" })
            .getByRole("button")
            .click();
        await page.waitForTimeout(100);

        await expect(page.getByText("The required minimum")).toBeVisible();
        await page.getByRole("textbox").nth(2).fill("TestPass1!@");
        await page.getByRole("textbox").nth(3).fill("TestPass2!@");
        await page
            .getByRole("main")
            .locator("div")
            .filter({ hasText: "Change Password Old password" })
            .getByRole("button")
            .click();
        await page.waitForTimeout(100);
    });

    test("Logout User", async ({ page }) => {
        await page.context().addCookies(cookies);

        await page.goto("/settings");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await page.getByRole("button", { name: "logout Log Off" }).click();

        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/login");

        await page.goto("/");
        expect(page.url()).toContain("/login");
    });

    test("Delete User", async ({ page, browserName }) => {
        await page.context().addCookies(cookies);

        await page.goto("/settings");
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain("/login");

        await expect(page.getByRole("button", { name: "edit" })).toBeVisible();
        await page.getByRole("button", { name: "edit" }).click();
        await page.waitForTimeout(500);

        await expect(
            page.getByRole("button", { name: "delete Delete Account" })
        ).toBeVisible();
        await page
            .getByRole("button", { name: "delete Delete Account" })
            .click();
        await page.waitForTimeout(500);

        await expect(
            page.locator("div").filter({ hasText: /^Delete Account$/ })
        ).toBeVisible();
        await expect(
            page.getByText("To delete your account, type")
        ).toContainText("uitests4" + browserName);
        await expect(
            page.getByPlaceholder("uitests4" + browserName)
        ).toBeVisible();
        await expect(
            page.getByRole("button", { name: "delete PERMANENTLY Delete" })
        ).toBeVisible();

        await page
            .getByPlaceholder("uitests4" + browserName)
            .fill("uitests4" + browserName);
        await page
            .getByRole("button", { name: "delete PERMANENTLY Delete" })
            .click();
        await page.waitForTimeout(500);

        await page.goto("/");
        expect(page.url()).toContain("/login");
    });

    test("Incorrect Login", async ({ page, browserName }) => {
        await page.goto("/");
        expect(page.url()).toContain("/login");

        expect(page.getByPlaceholder("Username")).toBeVisible();
        expect(page.getByPlaceholder("Password")).toBeVisible();
        expect(page.getByRole("button", { name: "Login" })).toBeVisible();

        await page.getByPlaceholder("Username").fill("uitests4" + browserName);
        await page.getByPlaceholder("Password").fill("TestPass2!@");
        await page.getByRole("button", { name: "Login" }).click();

        expect(page.url()).toContain("/login");
    });
});

test.afterAll(async ({ request, browserName }) => {
    let authorizationToken: string;

    var response = await request.post("http://localhost:8080/api/users/login", {
        data: {
            username: "uitests4" + browserName,
            password: "TestPass2!@",
        },
    });

    if (!response.ok()) {
        var response = await request.post(
            "http://localhost:8080/api/users/login",
            {
                data: {
                    username: "uitests4" + browserName,
                    password: "TestPass1!@",
                },
            }
        );
    }

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

    if (!response.ok()) {
        return true;
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

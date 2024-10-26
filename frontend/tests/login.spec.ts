import { test, expect } from "@playwright/test";

test.describe("Test Login UI", async () => {
    test.describe.configure({ mode: "serial" });

    test("Incorrect Login", async ({ page }) => {
        await page.goto("/");
        expect(page.url()).toContain("/login");

        expect(page.getByPlaceholder("Username")).toBeVisible();
        expect(page.getByPlaceholder("Password")).toBeVisible();
        expect(page.getByRole("button", { name: "Login" })).toBeVisible();

        await page.getByPlaceholder("Username").fill("uitests1");
        await page.getByPlaceholder("Password").fill("TestPass1!@");
        await page.getByRole("button", { name: "Login" }).click();

        expect(page.url()).toContain("/login");
    });

    test("Incorrect Register", async ({ page }) => {
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
        await page.getByPlaceholder("Username").fill("uitests1! ");
        await page.getByPlaceholder("Password").fill("TestPass1!@");
        expect(page.getByRole("button", { name: "Sign up" })).toBeDisabled();

        await page.getByPlaceholder("Username").fill("uitests1");
        await page.getByPlaceholder("Password").fill("TestPass1");
        expect(page.getByRole("button", { name: "Sign up" })).toBeEnabled();
        await page.getByRole("button", { name: "Sign up" }).click();
        expect(page.url()).toContain("/login");

        await page
            .getByRole("button", { name: "Create a new account" })
            .click();
        await page.getByPlaceholder("Display name").fill("UI Login Account");
        await page.getByPlaceholder("Username").fill("uitests1");
        await page.getByPlaceholder("Password").fill("TestPass!@");
        await page.getByRole("button", { name: "Sign up" }).click();
        expect(page.url()).toContain("/login");

        await page
            .getByRole("button", { name: "Create a new account" })
            .click();
        await page.getByPlaceholder("Display name").fill("UI Login Account");
        await page.getByPlaceholder("Username").fill("uitests1");
        await page.getByPlaceholder("Password").fill("testpass1!@");
        await page.getByRole("button", { name: "Sign up" }).click();
        expect(page.url()).toContain("/login");

        await page
            .getByRole("button", { name: "Create a new account" })
            .click();
        await page.getByPlaceholder("Display name").fill("UI Login Account");
        await page.getByPlaceholder("Username").fill("uitests1");
        await page.getByPlaceholder("Password").fill("TESTPASS1!@");
        await page.getByRole("button", { name: "Sign up" }).click();
        expect(page.url()).toContain("/login");

        await page
            .getByRole("button", { name: "Create a new account" })
            .click();
        await page.getByPlaceholder("Display name").fill("UI Login Account");
        await page.getByPlaceholder("Username").fill("uitests1");
        await page.getByPlaceholder("Password").fill("Te1!@");
        await page.getByRole("button", { name: "Sign up" }).click();
        expect(page.url()).toContain("/login");
    });

    test("Register User", async ({ page }) => {
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
        await page.getByPlaceholder("Username").fill("uitests1");
        await page.getByPlaceholder("Password").fill("TestPass1!@");
        await page.getByRole("button", { name: "Sign up" }).click();

        expect(page.url()).not.toContain("/login");
    });
});

test.afterAll(async ({ request }) => {
    let authorizationToken: string;

    var response = await request.post("http://127.0.0.1:8080/api/users/login", {
        data: {
            username: "uitests1",
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

    expect(response.ok).toBeTruthy();
    return true;
});

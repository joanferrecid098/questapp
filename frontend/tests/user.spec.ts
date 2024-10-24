import { test, expect } from "@playwright/test";

test("Try to Login User", async ({ page }) => {
    await page.goto("/");
    expect(page.url()).toContain("/login");
    expect(
        page.getByText("Invalid login credentials.").first()
    ).not.toBeVisible();

    await page.getByPlaceholder("Username").fill("testuser1");
    await page.getByPlaceholder("Password").fill("TestPass1!@");
    await page.getByRole("button", { name: "Login" }).click();

    expect(page.url()).toContain("/login");
    expect(page.getByText("Invalid login credentials.").first()).toBeVisible();
});

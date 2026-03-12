// @ts-ignore
import { test, expect, Page } from "@playwright/test";

test.describe("SwapConnect - Homepage", () => {
  test("should load homepage", async ({ page }: { page: Page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SwapConnect/);
  });

  test("should display navigation bar", async ({ page }: { page: Page }) => {
    await page.goto("/");
    const navbar = page.locator("nav");
    await expect(navbar).toBeVisible();
  });

  test("should have login link", async ({ page }: { page: Page }) => {
    await page.goto("/");
    const loginLink = page.locator('a:has-text("Login")').first();
    await expect(loginLink).toBeVisible();
  });

  test("should navigate to login page", async ({ page }: { page: Page }) => {
    await page.goto("/");
    await page.locator('a:has-text("Login")').first().click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("SwapConnect - Authentication", () => {
  test("login page should be accessible", async ({ page }: { page: Page }) => {
    await page.goto("/login");
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test("signup page should be accessible", async ({ page }: { page: Page }) => {
    await page.goto("/signup");
    const firstNameInput = page.locator('input[placeholder*="First Name"]');
    await expect(firstNameInput).toBeVisible();
  });
});

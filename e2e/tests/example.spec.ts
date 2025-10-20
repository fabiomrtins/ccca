import { test, expect } from "@playwright/test";

test("Should create an account", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const input = {
    name: "Mary Doe",
    email: "mary.doe@gmail.com",
    document: "71428793860",
    password: "aWEREGTWE16",
  };

  await page.locator(".input-name").fill(input.name);
  await page.locator(".input-email").fill(input.email);
  await page.locator(".input-document").fill(input.document);
  await page.locator(".input-password").fill(input.password);
  await page.locator(".button-signup").click();

  await expect(page.locator(".span-message")).toContainText("success");
});

test("Should create an account with invalid name", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  const input = {
    name: "Mary",
    email: "mary.doe@gmail.com",
    document: "71428793860",
    password: "aWEREGTWE16",
  };

  await page.locator(".input-name").fill(input.name);
  await page.locator(".input-email").fill(input.email);
  await page.locator(".input-document").fill(input.document);
  await page.locator(".input-password").fill(input.password);
  await page.locator(".button-signup").click();

  await expect(page.locator(".span-message")).toContainText("Invalid name");
});

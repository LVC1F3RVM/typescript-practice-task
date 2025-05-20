import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Login Functionality", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo("/");
  });

  test("Successful login with standard_user", async ({ page }) => {
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/inventory.html/);
  });

  test("Locked out user error message", async () => {
    await loginPage.login("locked_out_user", "secret_sauce");
    await loginPage.verifyErrorMessage(
      "Epic sadface: Sorry, this user has been locked out."
    );
  });

  test("Empty username validation", async () => {
    await loginPage.login("", "secret_sauce");
    await loginPage.verifyErrorMessage("Epic sadface: Username is required");
  });

  test("Empty password validation", async () => {
    await loginPage.login("standard_user", "");
    await loginPage.verifyErrorMessage("Epic sadface: Password is required");
  });

  test("Invalid credentials", async () => {
    await loginPage.login("invalid_user", "wrong_password");
    await loginPage.verifyErrorMessage(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });
});

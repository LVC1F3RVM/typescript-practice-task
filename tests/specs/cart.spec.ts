import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";

test.describe("Cart Functionality", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo("/");
    await loginPage.login("standard_user", "secret_sauce");

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test("Verify empty cart state", async () => {
    await inventoryPage.navigateTo("/cart.html");
    await cartPage.verifyCartIsEmpty();
  });

  test("Add item and verify cart contents", async () => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.navigateTo("/cart.html");
    await cartPage.verifyItemInCart("Sauce Labs Backpack");
  });

  test("Remove item from cart page", async () => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.navigateTo("/cart.html");
    await cartPage.removeItem("Sauce Labs Backpack");
    await cartPage.verifyCartIsEmpty();
  });

  test("Continue shopping redirect", async () => {
    await inventoryPage.navigateTo("/cart.html");
    await cartPage.continueShopping();
    await expect(inventoryPage.page).toHaveURL(/inventory.html/);
  });

  test("Proceed to checkout", async () => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.navigateTo("/cart.html");
    await cartPage.proceedToCheckout();
    await expect(cartPage.page).toHaveURL(/checkout-step-one.html/);
  });
});

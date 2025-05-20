import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";

test.describe("Inventory Page", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo("/");
    await loginPage.login("standard_user", "secret_sauce");

    await expect(page).toHaveURL(/inventory.html/);

    inventoryPage = new InventoryPage(page);
  });

  test("Verify inventory items display", async () => {
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test("Add single item to cart", async () => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.verifyCartBadgeCount(1);
  });

  test("Add multiple items to cart", async () => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.addItemToCart("Sauce Labs Bike Light");
    await inventoryPage.verifyCartBadgeCount(2);
  });

  test("Remove item from cart", async ({ page }) => {
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await inventoryPage.addItemToCart("Sauce Labs Bike Light");
    await page.click(".shopping_cart_link");
    await page.click("#remove-sauce-labs-backpack");
    await inventoryPage.verifyCartBadgeCount(1);
  });

  //   test('Sort products by price (low to high)', async () => {
  //     await inventoryPage.sortProducts('lohi');
  //     const prices = await inventoryPage.inventoryItems.locator('.inventory_item_price').allInnerTexts();
  //     const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
  //     const sortedPrices = [...numericPrices].sort((a, b) => a - b);
  //     expect(numericPrices).toEqual(sortedPrices);
  //   });

  test("Navigate to product detail page", async ({ page }) => {
    await page.click("#item_4_title_link");
    await expect(page).toHaveURL(
      "https://www.saucedemo.com/inventory-item.html?id=4"
    );
  });
});

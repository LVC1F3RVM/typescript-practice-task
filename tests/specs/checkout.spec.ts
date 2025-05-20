import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";

test.describe("Checkout Process", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo("/");
    await loginPage.login("standard_user", "secret_sauce");

    // 2. Wait for inventory page to load
    await expect(page).toHaveURL(/inventory.html/);

    // 3. Initialize other pages
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // 4. Add item to cart with verification
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");

    // 5. Navigate to cart and proceed to checkout
    await cartPage.navigateTo("/cart.html");
    await cartPage.proceedToCheckout();

    // 6. Verify checkout page loaded
    await expect(page).toHaveURL(/checkout-step-one.html/);
  });

  test("Complete checkout with valid information", async () => {
    await checkoutPage.fillShippingInfo("John", "Doe", "90210");
    await checkoutPage.continueToOverview();
    await checkoutPage.verifyOrderSummary();
    await checkoutPage.completePurchase();
    await checkoutPage.returnToInventory();
  });

  test("Validate empty first name", async () => {
    await checkoutPage.fillShippingInfo("", "Doe", "90210");
    await checkoutPage.pushContinueButton();
    await checkoutPage.verifyErrorMessage("Error: First Name is required");
  });

  test("Validate empty last name", async () => {
    await checkoutPage.fillShippingInfo("John", "", "90210");
    await checkoutPage.pushContinueButton();
    await checkoutPage.verifyErrorMessage("Error: Last Name is required");
  });

  test("Validate empty postal code", async () => {
    await checkoutPage.fillShippingInfo("John", "Doe", "");
    await checkoutPage.pushContinueButton();
    await checkoutPage.verifyErrorMessage("Error: Postal Code is required");
  });

  test("Cancel checkout from information page", async () => {
    await checkoutPage.cancelCheckout();
    await expect(checkoutPage.page).toHaveURL(/cart.html/);
  });

  test("Cancel checkout from overview page", async () => {
    await checkoutPage.fillShippingInfo("John", "Doe", "90210");
    await checkoutPage.continueToOverview();
    await checkoutPage.cancelCheckout();
    await expect(checkoutPage.page).toHaveURL(/inventory.html/);
  });
});

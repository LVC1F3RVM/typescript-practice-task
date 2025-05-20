import { expect } from "@playwright/test";
import BasePage from "./base.page";

export class CartPage extends BasePage {
  // Locators
  private get cartItems() {
    return this.page.locator(".cart_item");
  }
  private get checkoutButton() {
    return this.page.locator("#checkout");
  }
  private get continueShoppingButton() {
    return this.page.locator("#continue-shopping");
  }

  // Methods
  async verifyItemInCart(itemName: string, expectedQuantity: number = 1) {
    const item = this.cartItems.filter({ hasText: itemName });
    await expect(item).toBeVisible();
    if (expectedQuantity > 1) {
      await expect(item.locator(".cart_quantity")).toHaveText(
        expectedQuantity.toString()
      );
    }
  }

  async removeItem(itemName: string) {
    const item = this.cartItems.filter({ hasText: itemName });
    await item.locator('button:has-text("Remove")').click();
    await expect(item).not.toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one.html/);
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/inventory.html/);
  }

  async verifyCartIsEmpty() {
    await expect(this.cartItems).toHaveCount(0);
    await expect(this.checkoutButton).toBeVisible(); // Still visible but disabled in some implementations
  }
}

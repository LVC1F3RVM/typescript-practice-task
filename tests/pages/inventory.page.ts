import BasePage from "./base.page";
import { expect } from "@playwright/test";

export class InventoryPage extends BasePage {
  public get inventoryItems() {
    return this.page.locator(".inventory_item");
  }
  public get cartBadge() {
    return this.page.locator(".shopping_cart_badge");
  }

  async addItemToCart(itemName: string) {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator("button").click();
  }

  async verifyCartBadgeCount(count: number) {
    if (count > 0) {
      await expect(this.cartBadge).toHaveText(count.toString());
    } else {
      await expect(this.cartBadge).not.toBeVisible();
    }
  }
}

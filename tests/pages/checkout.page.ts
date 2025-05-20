import { expect } from "@playwright/test";
import BasePage from "./base.page";

export class CheckoutPage extends BasePage {
  // Locators (Step One)
  private get firstNameInput() {
    return this.page.locator("#first-name");
  }
  private get lastNameInput() {
    return this.page.locator("#last-name");
  }
  private get postalCodeInput() {
    return this.page.locator("#postal-code");
  }
  private get continueButton() {
    return this.page.locator("#continue");
  }
  private get cancelButton() {
    return this.page.locator("#cancel");
  }
  private get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  // Locators (Step Two)
  private get finishButton() {
    return this.page.locator("#finish");
  }
  private get summaryInfo() {
    return this.page.locator(".summary_info");
  }

  // Locators (Complete)
  private get completeHeader() {
    return this.page.locator(".complete-header");
  }
  private get backHomeButton() {
    return this.page.locator("#back-to-products");
  }

  // Methods
  async fillShippingInfo(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async pushContinueButton() {
    await this.continueButton.click();
  }

  async verifyErrorMessage(text: string) {
    await expect(this.errorMessage).toHaveText(text);
  }

  async continueToOverview() {
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two.html/);
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async verifyOrderSummary() {
    await expect(this.summaryInfo).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  async completePurchase() {
    await this.finishButton.click();
    await expect(this.page).toHaveURL(/checkout-complete.html/);
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
  }

  async returnToInventory() {
    await this.backHomeButton.click();
    await expect(this.page).toHaveURL(/inventory.html/);
  }
}

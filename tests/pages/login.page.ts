import BasePage from "./base.page";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {
  private get usernameInput() {
    return this.page.locator("#user-name");
  }
  private get passwordInput() {
    return this.page.locator("#password");
  }
  private get loginButton() {
    return this.page.locator("#login-button");
  }
  private get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyErrorMessage(text: string) {
    await expect(this.errorMessage).toHaveText(text);
  }
}

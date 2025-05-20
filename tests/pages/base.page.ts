import { Page } from "@playwright/test";

export default class BasePage {
  constructor(public page: Page) {}

  async navigateTo(path: string) {
    await this.page.goto(path);
  }
}

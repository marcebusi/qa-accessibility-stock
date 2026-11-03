import { Page } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async login(username = 'qa@test.com', password = 'TestPass123!') {
    await this.page.goto('/login')
    await this.page.fill('input[type="text"], input[name="username"]', username)
    await this.page.fill('input[type="password"]', password)
    await this.page.click('button[type="submit"]')
    await this.page.waitForURL(/dashboard|productos|home/, { timeout: 10_000 })
  }
}

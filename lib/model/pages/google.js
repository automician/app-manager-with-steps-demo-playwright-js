import { expect } from '@playwright/test'
import { TextInput } from '../controls/text-input.js'
import { withSteps } from '../../utils/reporting/steps.proxy.js'

export class Google {
  async open() {
    await this.page.goto('https://google.com/ncr')
  }

  /** @param { import('@playwright/test').Page } page */
  constructor(page) {
    this.page = page
    this.query = new TextInput(this.page.locator('[name="q"]'))
    this.results = this.page.locator('#rso .g[data-hveid]')
    this.firstResultHeader = this.results.first().locator('h3').first()

    return withSteps(this)
  }

  async shouldHaveResultsAtLeast(number) {
    await expect.poll(() => this.results.count()).toBeGreaterThanOrEqual(number)
  }

  _result(number) {
    return this.results.nth(number - 1)
  }

  async shouldHaveResult({ number, partialText = undefined, text = undefined }) {
    const result = this._result(number)
    if (!partialText && !text) await expect(result).toBeVisible()
    if (partialText) await expect(result).toContainText(partialText)
    if (text) await expect(result).toHaveText(text)
  }

  _resultHeader(number) {
    return this._result(number).locator('h3')
  }

  async search(text) {
    await this.query.pressSequentially(text).then(() => {
      this.page.keyboard.press('Enter')
    })
  }

  async followLinkOfResult(number) {
    await this._resultHeader(number).first().click()
  }
}

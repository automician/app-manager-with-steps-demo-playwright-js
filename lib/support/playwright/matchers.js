import * as playwright from '@playwright/test'
import config from '../../../playwright.config.js'

export const matchers = {
  /**
   * @param {playwright.Locator} locator
   * @param {number} expected
   * @param {{ timeout?: number }} options
   */
  async toHaveCountGreaterThanOrEqual(locator, expected, options = {}) {
    const name = 'toHaveCountGreaterThanOrEqual'
    /** @type {boolean} */
    let pass
    /** @type {number} */
    let actual

    try {
      /*
       * Below we are particulary interested in "expect with retries unless timeout reached".
       * There are two ways to do it via: expect.poll(function) and expect(function).toPass().
       * The `poll` option is not versatile, because, once called after "page context reload",
       * like "some action leading to changing page url", can lead to Error:
       *   * `Execution context was destroyed, most likely because of a navigation`
       * That, as explained in https://github.com/microsoft/playwright/issues/27406,
       * is "as expected":).
       * It would be great if we can customize "IgnoredExceptions" in context of "retries"...
       * Unfortunately, the Playwright API, unlike Selenium WebDriver API, does not provide
       * such functionality:'(.
       * The `toPass` option has not shown any simillar issues during our experiments.
       * So it is used below. Yet being not ideal, because leads to "double-logging" of its step
       * in the report.
       * There is a third option in playwright "to wait", it's `waitForFunction`,
       * // TODO: but we are not sure we can use `waitForFunction` with locator as 2nd arg,
       *          so it can be `resolved` on the client side, and so retried if failed.
       *          Let's do the corresponding investigation and figure this out.
       */
      // TODO: unfortunately expect below will not be nested into outer one
      //       that calls this condition... can we fix that (in logging/report)?
      await playwright
        .expect(async () => {
          const pollingMessage = `expect(${locator['_selector']}).${name}(${expected})`
          actual = await locator.count()
          pass = actual >= expected
          playwright.expect(pass, pollingMessage).toBeTruthy()
        })
        .toPass({ timeout: options.timeout ?? config.expect?.timeout ?? 4 * 1000 })
    } catch (e) {
      pass = false
    }

    // TODO: should we reuse somehow catched error (e), for example, to log it as reason... ?
    //       and should we customize IgnoredErrors?
    const message = pass
      ? () =>
          this.utils.matcherHint(name, undefined, undefined, {
            isNot: this.isNot,
          }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: ${this.isNot ? 'not' : ''}${this.utils.printExpected(
            expected,
          )}\n` +
          `Received: ${this.utils.printReceived(actual)}`
      : () =>
          this.utils.matcherHint(name, undefined, undefined, {
            isNot: this.isNot,
          }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: ${this.utils.printExpected(expected)}\n` +
          `Received: ${this.utils.printReceived(actual)}`

    return {
      message,
      pass,
      name,
      expected,
      actual,
    }
  },
}

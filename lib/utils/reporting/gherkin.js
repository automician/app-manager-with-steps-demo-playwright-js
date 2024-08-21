import { test } from '@playwright/test'

/**
 * @template T
 * @param {string} prefix
 * @returns {(title: string, body: () => T | Promise<T>) => Promise<T>}
 */
function Step(prefix) {
  // todo: make box configurable via project settings & dotenv
  return (title, body) => test.step(prefix + title, body, { box: true })
}

export const STEP = Step('')
export const GIVEN = Step('GIVEN ')
export const WHEN = Step('WHEN ')
export const THEN = Step('THEN ')
export const AND = Step('AND ')

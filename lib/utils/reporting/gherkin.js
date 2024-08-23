import { test } from '@playwright/test'

/**
 * @template T
 * @param {string} prefix
 * @returns {(titleOrBody?: string | (() => T | Promise<T>), bodyForTitle?: () => T | Promise<T>) => Promise<T>}
 */
function Step(prefix) {
  // todo: make box configurable via project settings & dotenv
  return (titleOrBody, bodyForTitle) =>
    // all steps are boxed below to render test lines in the report (here and below)
    titleOrBody === undefined
      ? test.step(prefix, () => undefined, { box: true })
      : titleOrBody instanceof Function
      ? test.step(prefix, titleOrBody, { box: true })
      : test.step(prefix + titleOrBody, bodyForTitle, { box: true })
}

export const STEP = Step('')
export const GIVEN = Step('GIVEN ')
export const WHEN = Step('WHEN ')
export const THEN = Step('THEN ')
export const AND = Step('AND ')

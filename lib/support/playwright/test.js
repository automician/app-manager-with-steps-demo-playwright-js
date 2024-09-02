import * as playwright from '@playwright/test'
import { matchers } from './matchers.js'
import { config } from '../../../project.config.js'
import * as expectations from './expectations.js'

const extendedExpect = playwright.expect.extend(matchers)

/** @type {typeof extendedExpect} */
export const expect = config.enableMatcherSteps
  ? expectations.withMatchersAsSteps(extendedExpect)
  : extendedExpect

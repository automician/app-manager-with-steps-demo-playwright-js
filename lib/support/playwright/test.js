import { expect as baseExpect } from '@playwright/test'
import { matchers } from './matchers.js'
import { config } from '../../../project.config.js'
import * as expectations from './expectations.js'

const extended_expect = baseExpect.extend(matchers)

/** @type {typeof extended_expect} */
export const expect = config.enableMatcherSteps
  ? expectations.withMatchersAsSteps(baseExpect)
  : extended_expect

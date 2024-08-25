import { expect as baseExpect } from '@playwright/test'
import { matchers } from './matchers.js'

export const expect = baseExpect.extend(matchers)

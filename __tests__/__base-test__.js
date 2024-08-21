import * as base from '@playwright/test'
import { AppManagerFixture } from '../lib/model/app-manager.fixture.js'

export const test = base.test.extend(AppManagerFixture)

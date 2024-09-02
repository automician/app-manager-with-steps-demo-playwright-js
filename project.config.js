import withEnvOverrides from './lib/support/config/withEnvOverrides.js'
import playwrightConfig from './playwright.config.js'

export const config = withEnvOverrides(
  {
    cancelWithSteps: false,
    enableMatcherSteps: false,
    /* ⬇️ sub-configs ⬇️ */
    playwright: playwrightConfig,
  },
  {
    ignore: ['playwright'],
  },
)

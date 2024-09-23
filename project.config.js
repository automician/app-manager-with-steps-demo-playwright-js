import withEnvOverrides from './lib/support/config/withEnvOverrides.js'
import playwrightConfig from './playwright.config.js'

export const config = withEnvOverrides(
  {
    cancelWithSteps: false,
    enableMatcherSteps: true,
    apiBaseURL: 'https://api.example.com',
    /* ⬇️ sub-configs ⬇️ */
    playwright: playwrightConfig,
  },
  {
    ignore: ['playwright'],
  },
)

import { test } from './__base-test__.js'

test('finds playwright', async ({ app }) => {
  await app.google.open()
  await app.google.query.shouldBeEmpty()

  await app.google.search('playwright')
  await app.google.shouldHaveResultsAtLeast(6)
  await app.google.shouldHaveResult({ number: 1, partialText: 'Playwright' })

  await app.google.followLinkOfResult(1)
  await app.shouldHavePageTitle(/Playwright/)
})

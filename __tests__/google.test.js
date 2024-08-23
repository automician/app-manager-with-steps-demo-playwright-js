import { GIVEN, THEN, WHEN } from '../lib/utils/reporting/gherkin.js'
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

test('finds playwright | AAA pattern', async ({ app }) => {
  GIVEN()
  await app.google.open()
  await app.google.query.shouldBeEmpty()

  WHEN()
  await app.google.search('playwright')

  THEN()
  await app.google.shouldHaveResultsAtLeast(10)
  await app.google.shouldHaveResult({ number: 1, partialText: 'Playwright' })
  await app.google.followLinkOfResult(1)
  await app.shouldHavePageTitle(/Playwright/)
})

test('finds playwright | AAA pattern (nested)', async ({ app }) => {
  await GIVEN(async () => {
    await app.google.open()
    await app.google.query.shouldBeEmpty()
  })

  await WHEN(async () => {
    await app.google.search('playwright')
  })

  await THEN(async () => {
    await app.google.shouldHaveResultsAtLeast(6)
    await app.google.shouldHaveResult({ number: 1, partialText: 'Playwright' })
    await app.google.followLinkOfResult(1)
    await app.shouldHavePageTitle(/Playwright/)
  })
})

test('finds playwright | AAA pattern (nested, with titles)', async ({ app }) => {
  await GIVEN('at google', async () => {
    await app.google.open()
    await app.google.query.shouldBeEmpty()
  })

  await WHEN('search for query', async () => {
    await app.google.search('playwright')
  })

  await THEN('should have found relevant results', async () => {
    await app.google.shouldHaveResultsAtLeast(6)
    await app.google.shouldHaveResult({ number: 1, partialText: 'Playwright' })
    await app.google.followLinkOfResult(1)
    await app.shouldHavePageTitle(/Playwright/)
  })
})

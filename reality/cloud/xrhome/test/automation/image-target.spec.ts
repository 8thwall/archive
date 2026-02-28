import {test, expect} from '@playwright/test'
import fs from 'fs'
import path from 'path'

const authFile = './playwright/.auth/playwright-auth-user.json'
const TESTING_PAGE = 'https://www-rc.8thwall.com/8w/staging-test/targets'

// NOTE(dat): We will need to move this out https://playwright.dev/docs/auth#reuse-signed-in-state
// So it can be reused (or run only once). For now, we keep it here to
// How to use this:
// 1. Run this test by itself by using the Testing tab on the left (In VSCode). This should get you
//    logged into Google Auth but doesn't log you into Niantic Auth.
// 2. Run each of the test one by one. Each time you need to click Google to auth into Niantic Auth.
test('authenticate', async ({page}) => {
  // Allow triple the timeout so you can log in
  test.slow()
  await page.goto(TESTING_PAGE)
  // This should trigger Google Auth since we gate these RC pages behind corporate acounts.
  // You suppose to type in your user name, password, then do the 2FA
  // We will wait until you are logged in.
  await page.waitForURL(TESTING_PAGE)
  // Save the context into the storage state
  await page.context().storageState({path: authFile})

  // Niantic ID kicks us to the 8th Wall logging page. Let's log into 8th Wall
  await page.goto(TESTING_PAGE)
  // Wait for network to be idle, if we save storage too early, needed storage values might not yet
  // be available
  await page.waitForLoadState('networkidle')
  // Save the context into the storage state. This time with the Niantic ID.
  await page.context().storageState({path: authFile})
})

// Since tests are run in parallel but each test is run in series, we can now reuse the storage
// state.
if (fs.existsSync(authFile)) {
  test.use({storageState: authFile})
}
test('Image target flat test', async ({page}) => {
  await page.goto(TESTING_PAGE)
  await page.waitForSelector('text=My Image Targets')

  await page.getByRole('button', {name: /flat/}).click()
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByText('Drag + Drop to UploadImages').click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(path.join(__dirname, './fixtures/flatTarget.jpg'))
  await page.getByRole('button', {name: 'Next'}).click()
  await page.getByRole('button', {name: 'Create'}).click()

  // Change the name
  await page.locator('#name-note').click()
  await page.locator('#name-note').fill('testImageFlat2')

  // Click around
  await page.getByRole('button', {name: 'Metadata'}).click()
  await page.getByText('Text').click()
  await page.getByText('JSON').click()
  await page.locator('div').filter({hasText: /^Close$/}).getByRole('button').click()
  await page.locator('label').filter({hasText: 'Load automatically'}).locator('span').click()
  await page.getByRole('button', {name: 'Close'}).click()

  // Check that the name exist in the page
  await expect(page.getByText('testImageFlat2')).toBeVisible()

  // Let's delete it
  await page.locator('div.image-item', {hasText: 'testImageFlat2'}).click()
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', {name: 'trash'}).click()

  await expect(page.getByText('testImageFlat2')).toHaveCount(0)
})

test('Image target cylindrical test', async ({page}) => {
  await page.goto(TESTING_PAGE)
  await page.waitForSelector('text=My Image Targets')

  await page.getByRole('button', {name: /cylindrical/}).click()
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByText(/Drag \+ Drop to Upload/).click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(path.join(__dirname, './fixtures/flatTarget.jpg'))
  await page.getByRole('button', {name: 'Next'}).click()
  await page.getByRole('button', {name: 'Create'}).click()
  await page.locator('#name-note').click()
  await page.locator('#name-note').fill('TestCylindrical2')
  await page.getByText('Measurements', {exact: true}).click()
  await page.locator('div').filter({hasText: /^Label Arc Length \(mm\)$/})
    .getByRole('textbox').click()
  await page.locator('div').filter({hasText: /^Label Arc Length \(mm\)$/})
    .getByRole('textbox').fill('55')
  await page.locator('div').filter({hasText: /^Cylinder Circumference \(mm\)$/})
    .getByRole('textbox').click()
  await page.locator('div').filter({hasText: /^Cylinder Circumference \(mm\)$/})
    .getByRole('textbox').fill('85')
  await page.getByRole('button', {name: 'Close'}).click()

  // Check that the name exist in the page
  await expect(page.getByText('TestCylindrical2')).toBeVisible()

  // Let's delete it
  await page.locator('div.image-item', {hasText: 'TestCylindrical2'}).click()
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', {name: 'trash'}).click()

  await expect(page.getByText('TestCylindrical2')).toHaveCount(0)
})

test('Image target conical test', async ({page}) => {
  test.slow()
  await page.goto(TESTING_PAGE)
  await page.waitForSelector('text=My Image Targets')

  await page.getByRole('button', {name: /cone/}).click()
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByText(/Drag \+ Drop to Upload/).click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(path.join(__dirname, './fixtures/flatTarget.jpg'))
  await page.getByRole('button', {name: 'Next'}).click()
  await page.getByRole('button', {name: 'Next'}).click()
  await page.getByRole('slider').fill('2646')
  await page.getByRole('button', {name: 'Next'}).click()
  await page.getByTestId('cropper').click()
  await page.getByTestId('cropper').click()
  await page.getByTestId('cropper').click()
  await page.getByTestId('container').click()
  await page.getByRole('button', {name: 'Create'}).click()

  // Change the name
  await page.locator('#name-note').click()
  await page.locator('#name-note').fill('testImageCone3')

  // Click around
  await page.getByRole('button', {name: 'Metadata'}).click()
  await page.getByText('Text').click()
  await page.getByText('JSON').click()
  await page.locator('div').filter({hasText: /^Close$/}).getByRole('button').click()
  await page.locator('label').filter({hasText: 'Load automatically'}).locator('span').click()
  await page.getByRole('button', {name: 'Close'}).click()

  // Check that the name exist in the page
  await expect(page.getByText('testImageCone3')).toBeVisible()

  // Let's delete it
  await page.locator('div.image-item', {hasText: 'testImageCone3'}).click()
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', {name: 'trash'}).click()

  await expect(page.getByText('testImageCone3')).toHaveCount(0)
})

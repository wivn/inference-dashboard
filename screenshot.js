import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to a desktop size
  await page.setViewportSize({ width: 1400, height: 900 });

  // Navigate to the app
  await page.goto('http://localhost:5173/inference-dashboard/');

  // Wait for the page to load
  await page.waitForTimeout(2000);

  // Click on the Architecture tab
  await page.click('text=Architecture');

  // Wait for the diagram to load
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: '/tmp/architecture-screenshot.png', fullPage: false });

  console.log('Screenshot saved to /tmp/architecture-screenshot.png');

  await browser.close();
})();

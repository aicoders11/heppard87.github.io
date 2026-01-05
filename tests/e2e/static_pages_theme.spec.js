const { test, expect } = require('@playwright/test');

test.describe('Static Page "Cyber-Glass" Theme Verification', () => {
  const pages = ['index.html', 'about.html', 'services.html', 'contact.html'];

  for (const page of pages) {
    test(`should correctly apply the theme to ${page}`, async ({ browser }) => {
      const context = await browser.newContext();
      const webPage = await context.newPage();
      // Using file:// protocol to load local files
      const absolutePath = `file:///app/${page}`;
      await webPage.goto(absolutePath);
      
      // Wait for any animations or transitions to complete
      await webPage.waitForTimeout(1000);

      // Ensure the main content is visible before taking a screenshot
      await expect(webPage.locator('main')).toBeVisible();

      // Take a screenshot of the full page
      await webPage.screenshot({
        path: `/home/jules/verification/static_theme_${page.replace('.html', '')}.png`,
        fullPage: true 
      });

      await webPage.close();
      await context.close();
    });
  }
});
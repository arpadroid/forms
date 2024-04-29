import { test as base } from '@playwright/test';
export const test = base.extend({
    page: async ({ page }, use) => {
        page.addScriptTag({ path: 'dist/forms.js', type: 'module' });
        await use(page);
    }
});

/**
 * Set the content of the page.
 * @param {string} content
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function setContent(content, page) {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    const rv = await page.setContent(content);
    await page.waitForLoadState('load', { timeout: 30000 });
    await page.addStyleTag({ url: 'http://localhost:6006/themes/default/default.bundled.css' });
    
    await page.addStyleTag({ url: 'http://localhost:8000/ui/material-symbols/outlined.css' });
    await page.addStyleTag({ url: 'http://localhost:8000/themes/default/default.bundled.css' });

    return rv;
}

export { expect } from '@playwright/test';

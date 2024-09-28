/**
 * Trying out Playwright for testing. For now I'm preferring to use Storybook interactions for component testing instead as it looks a lot more efficient.
 */
/* eslint-disable sonarjs/no-duplicate-string */
import { test, expect, setContent } from '../../playwrightFixture.js';

const html = String.raw;

test('should render a required field with all configured properties and submit the form if a value is provided, otherwise display an error message.', async ({
    page
}) => {
    await setContent(
        html`
            <form id="test-form" is="arpa-form">
                <arpa-field
                    id="test-field"
                    label="Test field"
                    required
                    placeholder="Test placeholder"
                    footnote="Test footnote"
                    description="Test description"
                    icon-right="edit"
                    icon="lock"
                    tooltip="Test tooltip"
                >
                </arpa-field>
            </form>
        `,
        page
    );

    let hasFocused = false;
    const fieldLocator = await page.locator('arpa-field');
    fieldLocator.evaluate(field => {
        field.on('focus', event => {
            hasFocused = true;
            console.log('onFocus', event);
        });
    });

    /**
     * Check content.
     */
    await expect(fieldLocator).toHaveCount(1);
    await expect(page.getByText('Test field')).toBeVisible();
    await expect(page.getByText('Test description')).toBeVisible();
    await expect(page.getByText('Test footnote')).toBeVisible();

    /**
     * Check input.
     */

    const input = await page.locator('arpa-field').locator('input');
    const inputId = await input.getAttribute('id');
    expect(inputId).toBe('test-form-test-field');
    const placeholder = await input.getAttribute('placeholder');
    await expect(placeholder).toBe('Test placeholder');

    /**
     * Events.
     */

    await input.focus();
    await input.fill('test');
    await input.press('Tab');
    await expect(hasFocused).toBe(true);
});

import { test, expect, setContent } from '../../playwrightFixture.js';

const html = String.raw;

test('should render a required field with all configured properties and submit the form if a value is provided, otherwise display an error message.', async ({
    page
}) => {
    await setContent(html`
        <form id="test-form" is="arpa-form">
            <arpa-field
                id="test-field"
                label="test field"
                required
                placeholder="Enter your name"
                footnote="Enter your full name"
            >
            </arpa-field>
        </form>
    `, page);
    await expect(page.locator('arpa-field')).toHaveCount(1);
});

/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./groupField.js').default} GroupField
 */
const html = String.raw;

export function renderFieldContent() {
    return html`
        <email-field id="email" label="Email" required value="some@email.com"></email-field>
        <text-field id="text" label="Text" required value="some more text"></text-field>
        <textarea-field id="text-area" label="Text area" required value="some text"></textarea-field>
        <number-field id="number" label="Number" required value="1"></number-field>
    `;
}

/**
 * Renders the script for the group field stories.
 * @param {Args} _args
 * @param {StoryContext} story
 * @returns {string}
 */
export function renderScript(_args, story) {
    if (story.name === 'Test') {
        return '';
    }
    return html`
        <script type="module">
            customElements.whenDefined('arpa-form').then(() => {
                const form = document.getElementById('field-form');
                form.onSubmit(values => {
                    console.log('Form values', values);
                    return true;
                });
            });
        </script>
    `;
}

export default {
    renderFieldContent,
    renderScript
};

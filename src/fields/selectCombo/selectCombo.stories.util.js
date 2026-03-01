/**
 * @typedef {import('./selectCombo.js').default} SelectCombo
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

const html = String.raw;

/**
 * Renders the script for the select combo stories.
 * @param {Args} _args
 * @param {StoryContext} story
 * @returns {string}
 */
export function renderScript(_args, story) {
    return story.name === 'Test'
        ? ''
        : html`
              <script type="module">
                  // We are going to set many options to the select combo field, therefore we'll do so programmatically.
                  import { CountryOptions } from '../../demo/demoFormOptions.js';
                  customElements.whenDefined('arpa-form').then(async () => {
                      const form = document.getElementById('field-form');
                      form.onSubmit(values => {
                          console.log('values2', values);
                          return true;
                      });
                  });
              </script>
          `;
}


export default {
    renderScript
}
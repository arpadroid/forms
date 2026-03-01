/**
 * @typedef {import('./optionsField.js').default} OptionsField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('@storybook/web-components-vite').ArgTypes} ArgTypes
 */

import { getArgs as fieldGetArgs, getArgTypes as fieldGetArgTypes } from '../field/field.stories.util.js';

const html = String.raw;

/**
 * Returns the HTML content for the options field stories, which includes three field-option elements.
 * @returns {string}
 */
export function renderFieldContent() {
    return html`
        <field-option value="option1" label="Option 1"></field-option>
        <field-option value="option2" label="Option 2"></field-option>
        <field-option value="option3" label="Option 3"></field-option>
    `;
}

/**
 * Returns the default arguments for the options field stories.
 * @returns {Args} The default arguments for the options field stories.
 */
export function getArgs() {
    return {
        autoFetchOptions: true,
        ...fieldGetArgs(),
        id: 'options-field',
        label: 'Options field',
        required: true
    };
}

/**
 * Returns the argument types for the options field stories.
 * @returns {ArgTypes} The argument types for the options field stories.
 */
export function getArgTypes() {
    return {
        autoFetchOptions: {
            control: 'boolean',
            table: { category: 'Options Field Props' }
        },
        fetchOptions: {
            // control: 'callback',
            table: { category: 'Options Field Props' }
        },
        ...fieldGetArgTypes('Field Props')
    };
}

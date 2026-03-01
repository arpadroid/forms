/**
 * @typedef {import('../../components/form/form.js').default} Form
 * @typedef {import('@storybook/web-components-vite').ArgTypes} ArgTypes
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { getArgTypes as fieldGetArgTypes, getArgs as fieldGetArgs } from '../field/field.stories.util.js';

/**
 * Returns the argument types for the date field stories.
 * @param {string} [category='Date Field Props'] - The category to group the props under in the Storybook UI.
 * @returns {ArgTypes} The argument types for the date field stories.
 */
export function getArgTypes(category = 'Date Field Props') {
    return {
        format: {
            table: { category }
        },
        disablePast: {
            table: { category }
        },
        disableFuture: {
            table: { category }
        },
        min: {
            control: { type: 'text' },
            table: { category }
        },
        max: {
            control: { type: 'text' },
            table: { category }
        },
        ...fieldGetArgTypes('Field Props')
    };
}

/**
 * Returns the default arguments for the date field stories.
 * @returns {Args} The default arguments for the date field stories.
 */
export function getArgs() {
    return {
        disablePast: false,
        disableFuture: false,
        min: '',
        max: '',
        ...fieldGetArgs(),
        id: 'date-field',
        label: 'Date Field',
        required: true
    };
}

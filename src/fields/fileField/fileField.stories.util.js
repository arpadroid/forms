/**
 * @typedef {import('../../components/form/form.js').default} Form
 * @typedef {import('@storybook/web-components-vite').ArgTypes} ArgTypes
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { getArgs as fieldGetArgs, getArgTypes as fieldGetArgTypes, renderField } from '../field/field.stories.util.js';
const html = String.raw;

/**
 * Renders the content for the file field stories.
 * @param {Args} _args - The story arguments.
 * @param {StoryContext} _story - The story context.
 * @returns {string}
 */
export function renderContent(_args, _story) {
    return '';
}

/**
 * Renders the script for the file field stories.
 * @param {Args} args - The story arguments.
 * @param {StoryContext} story - The story context.
 * @returns {string}
 */
export const renderScript = (args, story) => {
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
};

export function renderFieldContent() {
    return html`<file-item size="10000" src="http://localhost:8000/demo/assets/The Strange Case of Dr Jekyll and Mr Hyde.txt">
    </file-item>`;
}

/**
 * Renders the file field story.
 * @param {Args} args - The story arguments.
 * @param {StoryContext} story - The story context.
 */
export function renderFileField(args, story) {
    return renderField(args, story, 'file-field', renderFieldContent, renderScript);
}

/**
 * Returns the default arguments for the file field stories.
 * @returns {Args} The default arguments for the file field stories.
 */
export const getArgs = () => {
    return {
        allowMultiple: false,
        hasDropArea: true,
        extensions: 'txt, docx, pdf',
        minSize: 0,
        maxSize: 0,
        ...fieldGetArgs(),
        id: 'file-field-render',
        label: 'File field',
        required: true
    };
};

/**
 * Returns the argument types for the file field stories.
 * @param {string} [category='Props'] - The category to group the props under in the Storybook UI.
 * @returns {ArgTypes} The argument types for the file field stories.
 */
export const getArgTypes = (category = 'Props') => {
    return {
        extensions: {
            control: { type: 'text' },
            table: { category }
        },
        minSize: {
            control: { type: 'number' },
            table: { category }
        },
        maxSize: {
            control: { type: 'number' },
            table: { category }
        },
        hasDropArea: {
            control: { type: 'boolean' },
            table: { category }
        },
        allowMultiple: {
            control: { type: 'boolean' },
            table: { category }
        },
        ...fieldGetArgTypes(),
        onDelete: {
            action: 'onDelete',
            table: { category: 'Events' }
        },
        onUploadFile: {
            action: 'onUploadFile',
            table: { category: 'Events' }
        },
        onFilesAdded: {
            action: 'onFilesAdded',
            table: { category: 'Events' }
        }
    };
};

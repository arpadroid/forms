/**
 * @typedef {import('./field.js').default} Field
 * @typedef {import('../../components/form/form.js').default} Form
 * @typedef {import('@storybook/web-components-vite').ArgTypes} ArgTypes
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./field.stories.types').FieldPlaySetupOptionsType} FieldPlaySetupOptionsType
 * @typedef {import('./field.stories.types').FieldPlaySetupReturnType} FieldPlaySetupReturnType
 */

import { attrString } from '@arpadroid/tools';
import { fn, within, getByText } from 'storybook/test';

const html = String.raw;

/**
 * Renders the content for the field stories.
 * @param {Args} _args - The story arguments.
 * @param {StoryContext} _story - The story context.
 * @returns {string}
 */
export function renderContent(_args, _story) {
    return '';
}

/**
 * Renders the script for the field stories.
 * @param {Args} args - The story arguments.
 * @param {StoryContext} story - The story context.
 * @param {string} javaScript - Additional JavaScript to execute in the story.
 * @returns {string}
 */
export function renderScript(args, story, javaScript = '') {
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
                ${javaScript};
            });
        </script>
    `;
}

/**
 * Renders the field story.
 * @param {Args} args - The story arguments.
 * @param {StoryContext} story - The story context.
 * @param {string} fieldTag - The field tag to render.
 */
export function renderField(args, story, fieldTag = 'arpa-field', _renderContent = renderContent, _renderScript = renderScript) {
    return html`
            <arpa-form id="field-form">
                <${fieldTag} ${attrString(args)}>
                    ${_renderContent(args, story)}
                </${fieldTag}>
            </arpa-form>
            ${_renderScript(args, story)}
        `.trim();
}

/**
 * Setup test scenario for field stories.
 * @param {HTMLElement} canvasElement - The story canvas element.
 * @param {FieldPlaySetupOptionsType} [opt] - Optional setup options.
 * @returns {Promise<FieldPlaySetupReturnType>} The test setup result.
 */
export async function playSetup(canvasElement, opt) {
    const { fieldTag = 'arpa-field' } = opt || {};
    const canvas = within(canvasElement);
    await customElements.whenDefined(fieldTag);
    await customElements.whenDefined('submit-button');
    /** @type {Field | null} */
    const field = canvasElement.querySelector(`.arpaField, ${fieldTag}`);
    await field?.promise;
    /** @type {Form | null} */
    const form = canvasElement.querySelector('arpa-form');
    await form?.promise;
    form?.setAttribute('debounce', '0');
    const submitButton = getByText(canvasElement, 'Submit').closest('button');
    const onSubmitMock = fn(values => {
        // console.log('values', values);
        return true;
    });
    const onChangeMock = fn();
    form?.onSubmit(onSubmitMock);
    const onErrorMock = fn();
    if (typeof field?.on === 'function') {
        field.on('error', onErrorMock);
        field.on('change', onChangeMock);
    }
    /** @type {import('src/types').FieldInputType | null} */
    const input = (typeof field?.getInput === 'function' && field?.getInput()) || null;

    await new Promise(resolve => setTimeout(resolve, 100));
    return { canvas, field, form, submitButton, onSubmitMock, onErrorMock, onChangeMock, input };
}

/**
 * Returns the default arguments for the field stories.
 * @returns {Args} The default arguments.
 */
export function getArgs() {
    return {
        id: 'test-field',
        label: 'Field label',
        placeholder: '',
        description: '',
        footnote: '',
        tooltip: '',
        icon: '',
        iconRight: '',
        variant: '',
        value: '',
        readOnly: false,
        disabled: false,
        required: false,
        maxLength: 0,
        minLength: 0,
        content: '',
        onChange: fn(),
        onFocus: fn(),
        onSubmit: fn()
    };
}

/**
 * Returns the argument types for the field stories.
 * @param {string} category - The category for the argument table.
 * @returns {ArgTypes} The argument types.
 */
export function getArgTypes(category = 'Field Props') {
    return {
        required: {
            control: { type: 'boolean' },
            description: 'The field required state.',
            table: { category: 'Validation' }
        },
        maxLength: {
            control: { type: 'number' },
            description: 'The field maximum length.',
            table: { category: 'Validation' }
        },
        minLength: {
            control: { type: 'number' },
            description: 'The field minimum length.',
            table: { category: 'Validation' }
        },
        id: {
            description: 'The field id is required.',
            table: { category }
        },
        label: {
            description: 'The field label.',
            table: { category }
        },
        placeholder: {
            description: "The field's input placeholder.",
            table: { category }
        },
        description: {
            description: 'The field description.',
            table: { category }
        },
        footnote: {
            description: 'The field footnote.',
            table: { category }
        },
        tooltip: {
            description: 'The field tooltip.',
            table: { category }
        },
        icon: {
            description: 'The field icon.',
            table: { category }
        },
        iconRight: {
            description: 'The field right icon.',
            table: { category }
        },
        variant: {
            description: 'The field variant.',
            options: ['minimal', 'mini', 'large'],
            control: { type: 'select' },
            table: { category }
        },
        value: {
            description: 'The field value.',
            table: { category }
        },
        readOnly: {
            control: { type: 'boolean' },
            defaultValue: false,
            description: 'The field read-only state.',
            table: { category }
        },
        disabled: {
            description: 'The field disabled state.',
            control: { type: 'boolean' },
            table: { category }
        },
        content: {
            control: { type: 'text' },
            defaultValue: 'a',
            description: 'The field content.',
            table: { category }
        },
        onFocus: {
            action: 'onFocus',
            description: 'The field focus event.',
            table: { category: 'Events' }
        },
        onSubmit: {
            action: 'onSubmit',
            description: "The form's submit event.",
            table: { category: 'Events' }
        },
        onChange: {
            action: 'onChange',
            description: 'The field change event.',
            table: { category: 'Events' }
        }
    };
}

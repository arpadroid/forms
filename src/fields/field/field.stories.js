/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { fn } from '@storybook/test';
import { attrString } from '@arpadroid/tools';
import { action } from '@storybook/addon-actions';
// import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within, expect } from '@storybook/test';

const html = String.raw;

/**
 * Initialize the form component.
 */
function initializeForm() {
    const form = document.getElementById('fieldForm');
    console.log('form', form);
    const field = form.getField('test-field');
    console.log('field', field);
    field.listen('onFocus', event => {
        action('onFocus')(event);
    });
    form.onSubmit(values => {
        console.log('form values', values);
        return true;
    });
}

export default {
    title: 'Field',
  
    tags: ['autodocs'],
    render: args => {
        customElements.whenDefined('arpa-form').then(() => {
            requestAnimationFrame(() => initializeForm());
        });
        return html`
            <form id="fieldForm" is="arpa-form">
                <arpa-field id="test-field" ${attrString(args)}></arpa-field>
            </form>
        `;
    },
    argTypes: {},
    args: {}
};

export const Default = {
    play: async ({ canvasElement }) => {
        console.log('canvasElement', canvasElement);
        expect(canvasElement).toBeDefined();
    },
    /** @type {FieldInterface} */
    argTypes: {
        onFocus: {
            action: 'on-focus'
        }
    },
    args: {
        description: 'This is the field description',
        disabled: false,
        footnote: 'This is a footnote',
        icon: '',
        iconRight: 'edit',
        id: 'test-field',
        inputAttributes: {},
        inputTemplate: '',
        label: 'Field label',
        onChange: () => action('on-change'),
        onFocus: fn(),
        // onInitialized: (value, field) => true,
        outputObject: '',
        placeholder: 'placeholder',
        readOnly: false,
        regex: '',
        regexMessage: '',
        required: true,
        template: '',
        tooltip:
            'Lorem pisum dolor sit amet, consectetur adpisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscpit laboriosam,',
        value: '',
        variant: ''
    }
};

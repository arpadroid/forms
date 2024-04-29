/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { I18n } from '@arpadroid/i18n';
import { attrString } from '@arpadroid/tools';
import { action } from '@storybook/addon-actions';
import { waitFor, within, expect, fireEvent, fn, getByText } from '@storybook/test';

const html = String.raw;

/**
 * Initialize the form component.
 */

export const Default = {
    name: 'Render',
    /** @type {FieldInterface} */
    argTypes: {
        onFocus: {
            action: 'onFocus'
        },
        onChange: {
            action: 'onChange'
        }
    },
    parameters: {
        actions: { disable: true },
        options: {
            selectedPanel: 'storybook/options/panel'
        }
    },
    args: {
        id: 'test-field',
        label: 'Field label',
        placeholder: 'Please enter a value',
        description: 'Test description',
        footnote: 'This is a footnote',
        tooltip:
            'Lorem pisum dolor sit amet, consectetur adpisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscpit laboriosam,',
        icon: '',
        iconRight: 'edit',
        variant: '',
        value: '',
        readOnly: false,
        disabled: false,
        content: '',
        required: true,
        regex: '',
        regexMessage: '',
        onChange: action('onChange'),
        onFocus: action('onFocus'),
        inputTemplate: '',
        outputObject: ''
    }
};

const FieldStory = {
    title: 'Components/Field',
    tags: ['autodocs'],
    render: args => {
        return html`
            <form debounce="0" id="field-form" is="arpa-form">
                <arpa-field id="test-field" ${attrString(args)}></arpa-field>
            </form>
        `.trim();
    },
    argTypes: {},
    args: {}
};

/**
 * Get the field element.
 * @param {HTMLElement} canvasElement - The container node.
 * @returns {Promise<HTMLElement>} The field element.
 */
async function getField(canvasElement) {
    await waitFor(() => customElements.whenDefined('arpa-field'));
    return canvasElement.querySelector('arpa-field');
}

export const Test = {
    args: Default.args,
    parameters: {
        controls: { disable: true },
        ay11: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    play: async ({ canvasElement, args, step }) => {
        const canvas = within(canvasElement);
        const field = await getField(canvasElement);
        const form = canvasElement.querySelector('form');
        const submitButton = getByText(canvasElement, 'Submit').closest('button');
        const onSubmitMock = fn(() => true);
        form.onSubmit(onSubmitMock);
        const onErrorMock = fn(errors => {
            console.log('errors', errors);
        });
        field.listen('onError', onErrorMock);
        const input = canvas.getByRole('textbox');

        await step('Renders the field.', async () => {
            const canvas = within(canvasElement);
            await getField(canvasElement);
            canvas.getByText(args.label);
            canvas.getByText(args.description);
            canvas.getByText(args.footnote);
            const input = canvas.getByRole('textbox');
            expect(input.id).toBe('field-form-test-field');
            expect(input.placeholder).toBe(args.placeholder);
        });

        await step(
            'Submits form with empty required field and shows field and form error messages.',
            async () => {
                submitButton.click();
                await waitFor(() => {
                    canvas.getByText(I18n.get('modules.form.field.errRequired', false));
                    canvas.getByText(I18n.get('modules.form.formComponent.msgError', false));
                    expect(onErrorMock).toHaveBeenCalled();
                });
            }
        );

        await step('Calls onChange listener when change event is fired', () => {
            field.listen('onChange', args.onChange);
            expect(args.onChange).not.toHaveBeenCalled();
            input.value = 'test value';
            const event = new Event('input', { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
            expect(args.onChange).toHaveBeenLastCalledWith('test value', field);
            expect(field.getValue()).toBe(input.value).toBe('test value');
        });

        await step('Submits form with valid field value.', async () => {
            fireEvent.submit(form);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'test-field': 'test value' });
                canvas.getByText(I18n.get('modules.form.formComponent.msgSuccess', false));
            });
        });

        /**
         * OnFocus.
         */
        // await step('Calls onFocus listener when focus event is fired.', async () => {
        //     field.listen('onFocus', args.onFocus);
        //     input.focus();
        //     // await waitFor(() => expect(args.onFocus).toHaveBeenCalled());
        // });
    }
};

export default FieldStory;

/**
 * @typedef {import('./field.types').FieldConfigType} FieldConfigType
 * @typedef {import('./field').default} Field
 * @typedef {import('../../components/form/form').default} Form
 * @typedef {import('@storybook/web-components-vite').Meta<FieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<FieldConfigType>} Story
 */

import { I18n } from '@arpadroid/i18n';

import { waitFor, expect } from 'storybook/test';
import { getArgs, getArgTypes, playSetup, renderField } from './field.stories.util.js';

const html = String.raw;

/** @type {Meta} */
const FieldStory = {
    title: 'Forms/Field',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    render: renderField
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: {
        // actions: { disable: true },
        interactions: { disable: true },
        a11y: { disable: true },
        'storybook/interactions/panel': { disable: true },
        layout: 'padded',
        options: {
            selectedPanel: 'storybook/controls/panel'
        }
    },
    args: {
        ...getArgs(),
        required: true,
        placeholder: 'Please enter a value',
        description: 'Test description',
        footnote: 'This is a footnote',
        tooltip: 'test tooltip'
    },
    argTypes: getArgTypes()
};

/** @type {Story} */
export const Test = {
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' },
        layout: 'padded'
    },
    args: {
        ...Default.args,
        required: true,
        minLength: 2,
        maxLength: 10
    },
    play: async ({ canvasElement, step, args }) => {
        const { canvas, field, submitButton, onSubmitMock, onErrorMock, input: _input } = await playSetup(canvasElement);
        const input = /** @type {HTMLInputElement | null} */ (_input);
        if (!input) {
            throw new Error('Input element not found');
        }

        await step('Renders the field.', async () => {
            canvas.getByText(args.label);
            canvas.getByText(args.description);
            canvas.getByText(args.footnote);
            const input = canvas.getByRole('textbox');
            expect(input.id).toBe('field-form-test-field');
            expect(input.placeholder).toBe(args.placeholder);
        });

        await step('Submits form with empty required field and shows field and form error messages.', async () => {
            submitButton?.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.field.errRequired'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step(
            'Submits form with value not satisfying the minLength validation and shows field and form error messages.',
            async () => {
                input.value = 'a';
                submitButton?.click();
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.field.errMinLength', { minLength: args.minLength || '' }));
                    canvas.getByText(I18n.getText('forms.form.msgError'));
                    expect(onSubmitMock).not.toHaveBeenCalled();
                    expect(onErrorMock).toHaveBeenCalled();
                });
            }
        );

        await step(
            'Submits form with value not satisfying the maxLength validation and shows field and form error messages.',
            async () => {
                input.value = '12345678901';
                submitButton?.click();
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.field.errMaxLength', { maxLength: args.maxLength || '' }));
                    canvas.getByText(I18n.getText('forms.form.msgError'));
                    expect(onSubmitMock).not.toHaveBeenCalled();
                    expect(onErrorMock).toHaveBeenCalled();
                });
            }
        );

        await step('Calls onChange listener when change event is fired', async () => {
            args.onChange && field?.on('change', args.onChange);
            expect(args.onChange).not.toHaveBeenCalled();
            if (!input) {
                throw new Error('Input element not found');
            }
            input.value = 'test value';
            const event = new Event('input', { bubbles: true, cancelable: true });
            input?.dispatchEvent(event);
            await waitFor(() => {
                expect(args.onChange).toHaveBeenLastCalledWith('test value', field, expect.anything());
                expect(field?.getValue()).toBe('test value');
                expect(input.value).toBe('test value');
            });
        });

        await step('Submits form with valid field value.', async () => {
            submitButton?.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                expect(onSubmitMock).toHaveBeenCalledWith({ 'test-field': 'test value' });
            });
        });

        /**
         * OnFocus.
         */
        // await step('Calls onFocus listener when focus event is fired.', async () => {
        //     field.on('focus', args.onFocus);
        //     input.focus();
        //     // await waitFor(() => expect(args.onFocus).toHaveBeenCalled());
        // });
    }
};

/** @type {Story} */
export const Zones = {
    args: {
        id: 'zoned-field',
        content: 'Test content',
        label: undefined
    },
    render: args => {
        return html`
            <arpa-form id="field-form">
                <text-field required id="zone-field">
                    <arpa-zone name="label">Field label</arpa-zone>
                    <arpa-zone name="description">Test description</arpa-zone>
                    <arpa-zone name="footnote">This is a footnote</arpa-zone>
                    <arpa-zone name="tooltip">test tooltip</arpa-zone>
                    <arpa-zone name="input-rhs">
                        <icon-button icon="more_horiz">
                            <arpa-zone name="tooltip">More options</arpa-zone>
                        </icon-button>
                    </arpa-zone>
                    ${args.content}
                </text-field>
            </arpa-form>
        `;
    },
    play: async ({ step, canvas }) => {
        await step('Renders the zone content.', async () => {
            await waitFor(() => {
                expect(canvas.getByText('This is a footnote')).toBeInTheDocument();
                expect(canvas.getByText('Test description')).toBeInTheDocument();
                expect(canvas.getByText('test tooltip')).toBeInTheDocument();
                expect(canvas.getByText('Field label')).toBeInTheDocument();
            });
        });
    }
};

export default FieldStory;

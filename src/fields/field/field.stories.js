/**
 * @typedef {import('./field.types').FieldConfigType} FieldConfigType
 * @typedef {import('./field.js').default} Field
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 */
/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';
import { attrString } from '@arpadroid/tools';
import { action } from '@storybook/addon-actions';
import { waitFor, within, expect, fn, getByText } from '@storybook/test';
import Field from './field.js';

const html = String.raw;

const FieldStory = {
    title: 'Forms/Field',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    render: (
        args,
        story,
        fieldTag = 'arpa-field',
        renderContent = FieldStory.renderContent,
        renderScript = FieldStory.renderScript
    ) => {
        return html`
            <arpa-form id="field-form">
                <${fieldTag} ${attrString(args)}>
                    ${renderContent(args, story)}
                </${fieldTag}>
            </arpa-form>
            ${renderScript(args, story)}
        `.trim();
    },
    renderContent() {
        return '';
    },
    renderScript: (args, story, javaScript = '') => {
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
    },
    getArgs: () => {
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
            onChange: fn(() => action('onChange')),
            onFocus: fn(() => action('onFocus')),
            onSubmit: fn(() => action('onSubmit'))
        };
    },
    getArgTypes: (category = 'Field Props') => {
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
};

export const Default = {
    name: 'Render',
    /** @type {FieldConfigType} */

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
    defaultArgs: FieldStory.getArgs(),
    args: {
        ...FieldStory.getArgs(),
        required: true,
        placeholder: 'Please enter a value',
        description: 'Test description',
        footnote: 'This is a footnote',
        tooltip: 'test tooltip'
    },
    argTypes: FieldStory.getArgTypes()
};

export const Test = {
    args: Default.args,
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
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await customElements.whenDefined('arpa-field');
        await customElements.whenDefined('submit-button');
        /** @type {Field} */
        const field = canvasElement.querySelector('.arpaField');
        await field.promise;
        const form = canvasElement.querySelector('arpa-form');
        await form.promise;
        form.setAttribute('debounce', '0');
        const submitButton = getByText(canvasElement, 'Submit').closest('button');
        const onSubmitMock = fn(values => {
            console.log('values', values);
            return true;
        });
        const onChangeMock = fn();
        form.onSubmit(onSubmitMock);
        const onErrorMock = fn();
        if (typeof field.on === 'function') {
            field.on('error', onErrorMock);
            field.on('change', onChangeMock);
        }
        const input = typeof field?.getInput === 'function' && field?.getInput();

        await new Promise(resolve => setTimeout(resolve, 100));
        return { canvas, field, form, submitButton, onSubmitMock, onErrorMock, onChangeMock, input };
    },
    play: async ({ canvasElement, step, args }) => {
        const { canvas, field, submitButton, onSubmitMock, onErrorMock, input } = await Test.playSetup(canvasElement);

        await step('Renders the field.', async () => {
            canvas.getByText(args.label);
            canvas.getByText(args.description);
            canvas.getByText(args.footnote);
            const input = canvas.getByRole('textbox');
            expect(input.id).toBe('field-form-test-field');
            expect(input.placeholder).toBe(args.placeholder);
        });

        await step('Submits form with empty required field and shows field and form error messages.', async () => {
            submitButton.click();
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
                submitButton.click();
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.field.errMinLength', { minLength: args.minLength }));
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
                submitButton.click();
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.field.errMaxLength', { maxLength: args.maxLength }));
                    canvas.getByText(I18n.getText('forms.form.msgError'));
                    expect(onSubmitMock).not.toHaveBeenCalled();
                    expect(onErrorMock).toHaveBeenCalled();
                });
            }
        );

        await step('Calls onChange listener when change event is fired', async () => {
            field.on('change', args.onChange);
            expect(args.onChange).not.toHaveBeenCalled();
            input.value = 'test value';
            const event = new Event('input', { bubbles: true, cancelable: true });
            input.dispatchEvent(event);
            await waitFor(() => {
                expect(args.onChange).toHaveBeenLastCalledWith('test value', field, expect.anything());
                expect(field.getValue()).toBe(input.value).toBe('test value');
            });
        });

        await step('Submits form with valid field value.', async () => {
            submitButton.click();
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
                    <zone name="label">Field label</zone>
                    <zone name="description">Test description</zone>
                    <zone name="footnote">This is a footnote</zone>
                    <!-- <zone name="tooltip">test tooltip</zone> -->
                    <zone name="input-rhs">
                        <icon-button icon="more_horiz">
                            <zone name="tooltip-content">More options</zone>
                        </icon-button>
                    </zone>
                    ${args.content}
                </text-field>
            </arpa-form>
        `;
    }
    /**
     * Plays the zone field.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     * @todo Investigate why test is failing in CI.
     */
    // play: async ({ canvasElement, step }) => {
    //     const canvas = within(canvasElement);
    //     await new Promise(resolve => setTimeout(resolve, 500));
    //     await step('Renders the zone content.', async () => {
    //         expect(canvas.getByText('This is a footnote')).toBeInTheDocument();
    //         expect(canvas.getByText('Test description')).toBeInTheDocument();
    //         expect(canvas.getByText('test tooltip')).toBeInTheDocument();
    //         expect(canvas.getByText('Field label')).toBeInTheDocument();
    //     });
    // }
};

export default FieldStory;

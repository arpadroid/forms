/**
 * @typedef {import('./field.types').FieldConfigType} FieldConfigType
 * @typedef {import('./field').default} Field
 * @typedef {import('../../components/form/form').default} Form
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { I18n } from '@arpadroid/i18n';
import { attrString } from '@arpadroid/tools';
import { waitFor, within, expect, fn, getByText } from 'storybook/test';
// import Field from './field.js';

const html = String.raw;

/** @type {Meta} */
export const Story = {
    title: 'Forms/Field',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    render: (
        /** @type {Args} */ args,
        /** @type {StoryContext} */ story,
        fieldTag = 'arpa-field',
        renderContent = Story.renderContent,
        renderScript = Story.renderScript
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
    renderScript: (/** @type {Args} */ args, /** @type {StoryContext} */ story, javaScript = '') => {
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
            onChange: fn(),
            onFocus: fn(),
            onSubmit: fn()
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

/** @type {StoryObj} */
export const DefaultStory = {
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
    defaultArgs: Story.getArgs(),
    args: {
        ...Story.getArgs(),
        required: true,
        placeholder: 'Please enter a value',
        description: 'Test description',
        footnote: 'This is a footnote',
        tooltip: 'test tooltip'
    },
    argTypes: Story.getArgTypes()
};

/** @type {StoryObj} */
export const TestDefault = {
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' },
        layout: 'padded'
    },
    args: {
        ...DefaultStory.args,
        required: true,
        minLength: 2,
        maxLength: 10
    },
    playSetup: async (/** @type {HTMLElement} */ canvasElement) => {
        const canvas = within(canvasElement);
        await customElements.whenDefined('arpa-field');
        await customElements.whenDefined('submit-button');
        /** @type {Field | null} */
        const field = canvasElement.querySelector('.arpaField');
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
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step, args }) => {
        const { canvas, field, submitButton, onSubmitMock, onErrorMock, input } = await TestDefault.playSetup(canvasElement);

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
                submitButton?.click();
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
                expect(field.getValue()).toBe('test value');
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

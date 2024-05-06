/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { I18n } from '@arpadroid/i18n';
import { attrString } from '@arpadroid/tools';
import { action } from '@storybook/addon-actions';
import { waitFor, within, expect, fn, getByText } from '@storybook/test';

const html = String.raw;

/**
 * Initialize the form component.
 */

const DefaultArgs = {
    id: 'test-field',
    label: 'Field label',
    placeholder: '',
    description: '',
    footnote: '',
    tooltip: '',
    icon: '',
    iconRight: '',
    variant: 'default',
    value: '',
    readOnly: false,
    disabled: false,
    required: false,
    maxLength: 0,
    minLength: 0,
    content: '',
    onChange: action('onChange'),
    onFocus: action('onFocus'),
    onSubmit: action('onSubmit')
};

export const Default = {
    name: 'Render',
    /** @type {FieldInterface} */

    parameters: {
        // actions: { disable: true },
        interactions: { disable: true },
        a11y: { disable: true },
        'storybook/interactions/panel': { disable: true },
        options: {
            selectedPanel: 'storybook/controls/panel'
        }
    },
    defaultArgs: DefaultArgs,
    args: {
        required: false,
        ...DefaultArgs,
        placeholder: 'Please enter a value',
        description: 'Test description',
        footnote: 'This is a footnote',
        tooltip: 'test tooltip'
    },
    argTypes: {
        required: {
            control: { type: 'boolean' },
            description: 'The field required state.',
            table: {
                category: 'Validation'
            }
        },
        maxLength: {
            control: { type: 'number' },
            description: 'The field maximum length.',
            table: {
                category: 'Validation'
            }
        },
        minLength: {
            control: { type: 'number' },
            description: 'The field minimum length.',
            table: {
                category: 'Validation'
            }
        },
        id: {
            description: 'The field id is required.',
            table: {
                category: 'Base props'
            }
        },
        label: {
            description: 'The field label.',
            table: {
                category: 'Base props'
            }
        },
        placeholder: {
            description: "The field's input placeholder.",
            table: {
                category: 'Base props'
            }
        },
        description: {
            description: 'The field description.',
            table: {
                category: 'Base props'
            }
        },
        footnote: {
            description: 'The field footnote.',
            table: {
                category: 'Base props'
            }
        },
        tooltip: {
            description: 'The field tooltip.',
            table: {
                category: 'Base props'
            }
        },
        icon: {
            description: 'The field icon.',
            table: {
                category: 'Base props'
            }
        },
        iconRight: {
            description: 'The field right icon.',
            table: {
                category: 'Base props'
            }
        },
        variant: {
            description: 'The field variant.',
            options: ['default', 'minimal', 'mini', 'large'],
            control: { type: 'select' },
            table: {
                category: 'Base props'
            }
        },
        value: {
            description: 'The field value.',
            table: {
                category: 'Base props'
            }
        },
        readOnly: {
            control: { type: 'boolean' },
            defaultValue: false,
            description: 'The field read-only state.',
            table: {
                category: 'Base props'
            }
        },
        disabled: {
            description: 'The field disabled state.',
            control: { type: 'boolean' },
            table: {
                category: 'Base props'
            }
        },
        content: {
            control: { type: 'text' },
            defaultValue: 'a',
            description: 'The field content.',
            table: {
                category: 'Base props'
            }
        },
        onFocus: {
            action: 'onFocus',
            description: 'The field focus event.',
            table: {
                category: 'Events'
            }
        },
        onSubmit: {
            action: 'onSubmit',
            description: "The form's submit event.",
            table: {
                category: 'Events'
            }
        },
        onChange: {
            action: 'onChange',
            description: 'The field change event.',
            table: {
                category: 'Events'
            }
        }
    }
};

const FieldStory = {
    title: 'Components/Field',
    tags: [],
    render: (
        args,
        story,
        fieldTag = 'arpa-field',
        renderContent = FieldStory.renderContent,
        renderScript = FieldStory.renderScript
    ) => {
        return html`
            <form id="field-form" is="arpa-form">
                <${fieldTag} ${attrString(args)}>
                    ${renderContent(args, story)}
                </${fieldTag}>
            </form>
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
    }
};

export const Test = {
    args: Default.args,
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    args: {
        ...Default.args,
        required: true,
        minLength: 2,
        maxLength: 10
    },
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await waitFor(() => customElements.whenDefined('arpa-field'));
        const field = canvasElement.querySelector('.arpaField');
        const form = canvasElement.querySelector('form');
        form.setAttribute('debounce', '0');
        const submitButton = getByText(canvasElement, 'Submit').closest('button');
        const onSubmitMock = fn(() => true);
        const onChangeMock = fn();
        form.onSubmit(onSubmitMock);
        const onErrorMock = fn();
        if (typeof field.listen === 'function') {
            field.listen('onError', onErrorMock);
            field.listen('onChange', onChangeMock);
        }
        const input = field?.input;
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
                canvas.getByText(I18n.getText('modules.form.field.errRequired'));
                canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
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
                    canvas.getByText(I18n.getText('modules.form.field.errMinLength', { minLength: args.minLength }));
                    canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
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
                    canvas.getByText(I18n.getText('modules.form.field.errMaxLength', { maxLength: args.maxLength }));
                    canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
                    expect(onSubmitMock).not.toHaveBeenCalled();
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
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
                expect(onSubmitMock).toHaveBeenCalledWith({ 'test-field': 'test value' });
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

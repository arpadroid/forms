/**
 * @typedef {import('./field.types').FieldConfigType} FieldConfigType
 * @typedef {import('./field.stories.types').FieldPlaySetupReturnType} FieldPlaySetupReturnType
 * @typedef {import('./field.stories.types').FieldPlayConfigType} FieldPlayConfigType
 * @typedef {import('./field').default} Field
 * @typedef {import('../../components/form/form').default} Form
 * @typedef {import('@storybook/web-components-vite').StoryContext['canvas']} Canvas
 * @typedef {import('@storybook/web-components-vite').Meta<FieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<Required<FieldConfigType>>} Story
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fn, userEvent } from 'storybook/test';
import { testParams, defaultParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';

const html = String.raw;

/**
 * Sets up the play function environment for the field story.
 * @param {FieldPlayConfigType} config - The configuration for the field component.
 * @returns {Promise<FieldPlaySetupReturnType>} The setup objects for the play function.
 */
export async function playSetup({ tag = 'arpa-field', canvasElement, canvas, inputSelector = '.arpaField__input' }) {
    const form = /** @type {Form} */ (canvasElement.querySelector('arpa-form'));
    await form?.promise;
    const field = /** @type {Field} */ (canvasElement.querySelector(tag));
    await field?.promise;

    const input = /** @type {HTMLInputElement} */ (canvasElement.querySelector(inputSelector));
    const submitButton = /** @type {HTMLButtonElement} */ (canvas.getByRole('button', { name: /submit/i }));
    const onSubmitMock = fn(_values => {
        // console.log('values', values);
        return true;
    });

    form?.onSubmit(onSubmitMock);
    const onErrorMock = fn();
    const onChangeMock = fn();
    const onFocusMock = fn();
    field.on('error', onErrorMock);
    field.on('change', onChangeMock);
    field.on('focus', onFocusMock);
    return { field, submitButton, onSubmitMock, onErrorMock, onChangeMock, onFocusMock, input, form };
}

/** @type {Meta} */
const FieldStory = {
    title: 'Forms/Field',
    component: 'arpa-field',
    excludeStories: ['playSetup'],
    parameters: {
        layout: 'padded'
    },
    args: {
        id: 'test-field',
        label: 'Field label',
        required: true,
        placeholder: 'Please enter a value',
        description: 'Test description',
        footnote: 'This is a footnote',
        tooltip: 'test tooltip'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <arpa-field ${$attr(args)}></arpa-field>
        </arpa-form>
    `
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    parameters: testParams,
    args: {
        id: 'test-field',
        required: true,
        minLength: 2,
        icon: 'person',
        labelIcon: 'label',
        maxLength: 10
    },
    play: async ({ canvasElement, canvas, step, args }) => {
        const { field, form, submitButton, onSubmitMock, onErrorMock, onChangeMock, onFocusMock, input } = await playSetup({
            canvasElement,
            canvas
        });

        await step('Renders the field.', async () => {
            expect(form).toBeInTheDocument();
            expect(field).toBeInTheDocument();
            expect(input).toBeInTheDocument();
            expect(canvas.getByText(args.label)).toBeInTheDocument();
            expect(canvas.getByText(args.description)).toBeInTheDocument();
            expect(canvas.getByText(args.footnote)).toBeInTheDocument();
            expect(input.id).toBe('test-form-test-field');
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
            expect(onChangeMock).not.toHaveBeenCalled();
            input.value = 'test value';
            const event = new Event('input', { bubbles: true, cancelable: true });
            input?.dispatchEvent(event);
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith('test value', field, expect.anything());
                expect(field?.getValue()).toBe('test value');
                expect(input.value).toBe('test value');
            });
        });

        await step('Submits form with valid field value.', async () => {
            await userEvent.click(submitButton, { delay: 100 });
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                expect(onSubmitMock).toHaveBeenCalledWith({ 'test-field': 'test value' });
            });
        });
        /**
         * OnFocus.
         */
        await step('Calls onFocus listener when focus event is fired.', async () => {
            input.focus();
            await waitFor(() => expect(onFocusMock).toHaveBeenCalled());
        });
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
            <arpa-form id="test-form">
                <text-field required id="zone-field">
                    <arpa-zone name="label">Zone label</arpa-zone>
                    <arpa-zone name="description">Zone description</arpa-zone>
                    <arpa-zone name="footnote">Zone footnote</arpa-zone>
                    <arpa-zone name="tooltip">Zone tooltip</arpa-zone>
                    <arpa-zone name="inputRhs">
                        <icon-button icon="more_horiz">
                            <arpa-zone name="tooltip">Rhs tooltip</arpa-zone>
                        </icon-button>
                    </arpa-zone>
                    ${args.content}
                </text-field>
            </arpa-form>
        `;
    },
    play: async ({ step, canvas }) => {
        await step('Renders the zone content.', async () => {
            await waitFor(async () => {
                expect(canvas.getByText('Zone footnote')).toBeInTheDocument();
                expect(canvas.getByText('Zone description')).toBeInTheDocument();
                expect(canvas.getByText('Zone tooltip')).toBeInTheDocument();
                expect(canvas.getByText('Zone label')).toBeInTheDocument();
            });
            const rhsTooltip = canvas.getByText('Rhs tooltip');
            await userEvent.click(rhsTooltip);
            await waitFor(() => {
                expect(rhsTooltip).toBeInTheDocument();
            });
        });
    }
};

/** @type {Story} */
export const Minimal = {
    args: {
        id: 'minimal-field',
        label: undefined,
        description: undefined,
        footnote: undefined,
        tooltip: undefined,
        placeholder: 'minimal field',
        required: 'false',
        icon: undefined,
        iconRight: undefined
    },

    play: async ({ step, canvasElement }) => {
        await step('Renders the field.', async () => {
            await waitFor(() => {
                const input = canvasElement.querySelector('#test-form-minimal-field');
                expect(input).toBeInTheDocument();
                expect(input).toHaveAttribute('placeholder', 'minimal field');
            });
        });

        await step('Does not render empty elements.', async () => {
            const label = canvasElement.querySelector('label');
            expect(label).not.toBeInTheDocument();

            const description = canvasElement.querySelector('.arpaField__description');
            expect(description).not.toBeInTheDocument();

            const footnote = canvasElement.querySelector('.arpaField__footnote');
            expect(footnote).not.toBeInTheDocument();

            const tooltip = canvasElement.querySelector('.arpaField__tooltip:not(.arpaField__errors)');
            expect(tooltip).not.toBeInTheDocument();

            const inputMask = canvasElement.querySelector('.arpaField__inputMask');
            expect(inputMask).not.toBeInTheDocument();
        });
    }
};

export default FieldStory;

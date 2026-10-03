/**
 * @typedef {import('./passwordField.types.js').PasswordFieldConfigType} PasswordFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<PasswordFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<PasswordFieldConfigType>} Story
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const PasswordFieldStory = {
    title: 'Forms/Fields/Password',
    component: 'password-field',
    args: {
        id: 'password-field',
        label: 'Password Field',
        required: true,
        icon: 'lock',
        confirm: true,
        mode: 'register'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <password-field ${$attr(args)}></password-field>
        </arpa-form>
    `
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const ConfirmMode = {
    parameters: testParams,
    args: {
        confirm: true
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'password-field',
            canvas,
            canvasElement
        });

        const { submitButton, onErrorMock, onSubmitMock, input } = setup;
        const field = /** @type {import('./passwordField.js').default} */ (setup.field);

        await step('Renders the field with confirm field.', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Password Field')).toBeInTheDocument();
                expect(canvas.getByText('Confirm Password')).toBeInTheDocument();
            });
        });

        await step('Tests visibility button.', async () => {
            const buttons = await waitFor(() =>
                canvas.getAllByRole('button', {
                    name: 'Show password'
                })
            );
            input.value = 'password';
            input.focus();
            await waitFor(() => {
                expect(canvas.getAllByText('Show password')).toHaveLength(2);
            });

            expect(input.type).toBe('password');
            await userEvent.click(buttons[0]);
            expect(input.type).toBe('text');
            await waitFor(() => {
                expect(canvas.getByText('Hide password')).toBeInTheDocument();
            });
            await userEvent.click(buttons[0]);
            expect(input.type).toBe('password');
        });

        await step('Submits form with invalid password and empty confirm value and receives expected message.', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.fields.password.errRegex'))).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText('forms.field.errRequired'))).toBeInTheDocument();
            });
        });

        await step('Submits form with valid password and invalid confirm value and receives expected message.', async () => {
            input.value = 'P455w0rd??';
            if (field.confirmField?.input instanceof HTMLInputElement) {
                field.confirmField.input.value = 'P455w0rd?!!?';
            }
            await userEvent.click(submitButton, { delay: 100 });
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.fields.password.errPasswordMatch'))).toBeInTheDocument();
            });
        });

        await step('Submits form with valid password and confirm value and receives expected message.', async () => {
            if (field.confirmField?.input instanceof HTMLInputElement) {
                field.confirmField.input.value = 'P455w0rd??';
            }
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({
                    'password-field': 'P455w0rd??'
                });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Story} */
export const LoginMode = {
    parameters: testParams,
    args: {
        required: true,
        mode: 'login',
        confirm: false
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'password-field',
            canvas,
            canvasElement
        });

        const { submitButton, onSubmitMock } = setup;
        const field = /** @type {import('./passwordField.js').default} */ (setup.field);

        await step('Renders the field with confirm field.', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Password Field')).toBeInTheDocument();
            });
        });

        await step(
            'Switches mode to login and removes confirm field, then submits form successfully without validation.',
            async () => {
                await field.promise;
                
                await waitFor(() => {
                    expect(canvas.queryByText('Confirm Password')).not.toBeInTheDocument();
                });
                await field.setValue('pass');
                await userEvent.click(submitButton);
                await waitFor(() => {
                    expect(onSubmitMock).toHaveBeenLastCalledWith({
                        'password-field': 'pass'
                    });
                    canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                });
            }
        );
    }
};

export default PasswordFieldStory;

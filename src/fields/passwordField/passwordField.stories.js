/**
 * @typedef {import('./passwordField.js').default} PasswordField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from 'storybook/test';
import { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { getArgs, getArgTypes, playSetup, renderField } from '../field/field.stories.util.js';

const category = 'Password Field Props';

/** @type {Meta} */
const PasswordFieldStory = {
    title: 'Forms/Fields/Password',
    tags: [],
    render: (args, story) => renderField(args, story, 'password-field')
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        confirm: {
            control: { type: 'boolean' },
            table: { category }
        },
        mode: {
            control: { type: 'select' },
            options: [null, 'login', 'register'],
            table: { category }
        },
        ...getArgTypes('Field Props')
    },
    args: {
        confirm: true,
        mode: 'register',
        // confirm: true,
        ...getArgs(),
        id: 'password-field',
        label: 'Password Field'
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        mode: 'register',
        confirm: true
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'password-field'
        });
        const { submitButton, canvas, onErrorMock, onSubmitMock } = setup;
        const input = /** @type {HTMLInputElement} */ (setup.input);
        const field = /** @type {PasswordField} */ (setup.field);
        if (!field) throw new Error('PasswordField not found in the setup.');
        if (!input) throw new Error('Input element not found in the setup.');

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
            await fireEvent.click(buttons[0]);
            expect(input.type).toBe('text');
            await waitFor(() => {
                expect(canvas.getByText('Hide password')).toBeInTheDocument();
            });
            await fireEvent.click(buttons[0]);
            expect(input.type).toBe('password');
        });

        await step('Submits form with invalid password and empty confirm value and receives expected message.', async () => {
            submitButton?.click();
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
            submitButton?.click();
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
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({
                    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
                    'password-field': 'P455w0rd??'
                });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step(
            'Switches mode to login and removes confirm field, then submits form successfully without validation.',
            async () => {
                await field.promise;
                field.setAttribute('mode', 'login');
                field.removeAttribute('regex');
                await waitFor(() => {
                    expect(canvas.queryByText('Confirm Password')).not.toBeInTheDocument();
                });
                await field.setValue('pass');
                submitButton?.click();
                await waitFor(() => {
                    expect(onSubmitMock).toHaveBeenLastCalledWith({
                        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
                        'password-field': 'pass'
                    });
                    canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                });
            }
        );
    }
};

export default PasswordFieldStory;

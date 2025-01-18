/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const PasswordFieldStory = {
    title: 'Forms/Fields/Password',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'password-field')
};
const category = 'Password Field Props';
export const Default = {
    name: 'Render',
    /** @type {FieldInterface} */
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
        ...FieldStory.getArgTypes('Field Props')
    },
    args: {
        confirm: true,
        mode: 'register',
        // confirm: true,
        ...FieldStory.getArgs(),
        id: 'password-field',
        label: 'Password Field'
    }
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        mode: 'register',
        confirm: true
    },
    play: async ({ canvasElement, step }) => {
        const { input, submitButton, canvas, onErrorMock, onSubmitMock, field } = await FieldTest.playSetup(canvasElement);

        await step('Renders the field with confirm field.', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Password Field')).toBeInTheDocument();
                expect(canvas.getByText('Confirm Password')).toBeInTheDocument();
            });
        });

        await step('Tests visibility button.', async () => {
            const buttons = canvas.getAllByRole('button', {
                name: 'Show password'
            });
            input.value = 'password';
            expect(input.type).toBe('password');
            await fireEvent.click(buttons[0]);
            expect(input.type).toBe('text');
            await fireEvent.click(buttons[0]);
            expect(input.type).toBe('password');
        });

        await step('Submits form with invalid password and empty confirm value and receives expected message.', async () => {
            submitButton.click();
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
            field.confirmField.input.value = 'P455w0rd?!!?';
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.fields.password.errPasswordMatch'))).toBeInTheDocument();
            });
        });

        await step('Submits form with valid password and confirm value and receives expected message.', async () => {
            field.confirmField.input.value = 'P455w0rd??';
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({
                    'password-field': 'P455w0rd??'
                });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step(
            'Switches mode to login and removes confirm field, then submits form successfully without validation.',
            async () => {
                field.setAttribute('mode', 'login');
                field.removeAttribute('regex');
                await waitFor(() => {
                    expect(canvas.queryByText('Confirm Password')).not.toBeInTheDocument();
                });
                input.value = 'pass';
                submitButton.click();
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

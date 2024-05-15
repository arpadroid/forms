import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const TextFieldStory = {
    title: 'Fields/Email',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'email-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...FieldStory.getArgTypes() },
    args: {
        ...FieldStory.getArgs(),
        id: 'email-field',
        label: 'Email Field'
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async ({ canvasElement, step }) => {
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } =
            await FieldTest.playSetup(canvasElement);

        await step(
            'Submits form with invalid regex value "some value" and checks for error messages.',
            () => {
                input.value = 'some value';
                submitButton.click();
            }
        );

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText(I18n.getText('modules.form.fields.email.errRegex'));
                canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(1);
            });
        });

        await step(
            'Submits form with invalid value "some@value" and checks for error messages.',
            async () => {
                input.value = 'some@value';
                submitButton.click();
                await waitFor(() => {
                    canvas.getByText(I18n.getText('modules.form.fields.email.errRegex'));
                    canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
                    expect(onErrorMock).toHaveBeenCalledTimes(2);
                });
            }
        );

        await step('Submits form with valid field value.', async () => {
            input.value = 'email@somewhere.com';
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'email-field': 'email@somewhere.com' });
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
            });
        });
    }
};

export default TextFieldStory;

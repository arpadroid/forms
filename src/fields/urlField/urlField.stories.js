import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const UrlFieldStory = {
    title: 'Forms/Fields/Url',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'url-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...FieldStory.getArgTypes() },
    args: {
        ...FieldStory.getArgs(),
        id: 'url-field',
        label: 'URL Field'
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async ({ canvasElement, step }) => {
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = await FieldTest.playSetup(canvasElement);

        await step('Submits form with invalid regex value "some value" and checks for error messages.', async () => {
            input.value = 'some value';
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.url.errUrl'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'https://www.example.com';
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'url-field': 'https://www.example.com' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default UrlFieldStory;

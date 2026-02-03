/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('../groupField/groupField.js').default} GroupField
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

/** @type {Meta} */
const TextFieldStory = {
    title: 'Forms/Fields/Email',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) => FieldStory.render(args, story, 'email-field')
};

/** @type {StoryObj} */
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

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = await FieldTest.playSetup(canvasElement);

        await step('Submits form with invalid regex value "some value" and checks for error messages.', () => {
            input.value = 'some value';
            submitButton?.click();
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.email.errRegex'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Submits form with invalid value "some@value" and checks for error messages.', async () => {
            input.value = 'some@value';
            submitButton?.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.email.errRegex'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(2);
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'email@somewhere.com';
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'email-field': 'email@somewhere.com' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default TextFieldStory;

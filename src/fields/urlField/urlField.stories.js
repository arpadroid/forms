/** @typedef {import('@storybook/web-components-vite').Meta} Meta */
/** @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj */
/** @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext */
/** @typedef {import('@storybook/web-components-vite').Args} Args */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

/** @type {Meta} */
const UrlFieldStory = {
    title: 'Forms/Fields/Url',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) => FieldStory.render(args, story, 'url-field')
};

/** @type {StoryObj} */
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

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = await FieldTest.playSetup(canvasElement);

        await step('Submits form with invalid regex value "some value" and checks for error messages.', async () => {
            input.value = 'some value';
            submitButton?.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.url.errUrl'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'https://www.example.com';
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'url-field': 'https://www.example.com' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default UrlFieldStory;

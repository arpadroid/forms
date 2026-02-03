/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { I18n } from '@arpadroid/i18n';

const html = String.raw;

/** @type {Meta} */
const ColorFieldStory = {
    title: 'Forms/Fields/Color',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) => FieldStory.render(args, story, 'color-field')
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...FieldStory.getArgTypes('Field Props')
    },
    args: {
        ...FieldStory.getArgs(),
        id: 'color-field-test',
        label: 'Color Field',
        required: true
    }
};

/** @type {StoryObj} */
export const Test = {
    args: {
        ...Default.args,
        id: 'color-field',
        required: true
    },
    parameters: { ...FieldTest.parameters },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const {  canvas, onErrorMock, form, onSubmitMock, field } = setup;
        const textInput = field.textInput;
        await step('sets value red to text input and checks that color input has appropriate value', async () => {
            await userEvent.type(textInput, 'red');
            await waitFor(() => expect(field.getValue()).toBe('#ff0000'));
        });

        await step('Sets invalid value and checks for error message', async () => {
            textInput.value = 'invalid';
            await fireEvent.submit(form);
            await waitFor(() => {
                canvas.getByText(field.i18nText('errColor'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
            });
            expect(onErrorMock).toHaveBeenCalledOnce();
        });

        await step('Submits form with valid field value.', async () => {
            textInput.value = '';
            await userEvent.type(textInput, 'blue');
            await fireEvent.submit(form);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'color-field': '#0000ff' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default ColorFieldStory;

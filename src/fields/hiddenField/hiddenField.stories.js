/**
 * @typedef {import('../field/field.types').FieldConfigType} FieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, fireEvent, waitFor } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { I18n } from '@arpadroid/i18n';

const html = String.raw;

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {},
    args: {
        value: 'hidden value',
        id: 'hidden-field'
    }
};

/** @type {Meta} */
const TextFieldStory = {
    title: 'Forms/Fields/Hidden',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) => FieldStory.render(args, story, 'hidden-field')
};

/** @type {StoryObj} */
export const Test = {
    args: { ...Default.args },
    parameters: { ...FieldTest.parameters },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { submitButton, canvas, onSubmitMock } = await FieldTest.playSetup(canvasElement);
        await step('Submits form with field value.', async () => {
            await fireEvent.click(submitButton);    
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'hidden-field': 'hidden value' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextFieldStory;

/**
 * @typedef {import('./telField.js').default} TelField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { getArgs, getArgTypes, playSetup, renderField } from '../field/field.stories.util.js';

/** @type {Meta} */
const TextFieldStory = {
    title: 'Forms/Fields/Tel',
    tags: [],
    render: (args, story) => renderField(args, story, 'tel-field')
};

// const category = 'Tel Field Props';

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...getArgTypes()
    },
    args: {
        ...getArgs(),
        id: 'tel-field',
        label: 'Tel Field',
        required: true
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        regex: Default.args?.regex,
        regexMessage: Default.args?.regexMessage
    },
    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'tel-field'
        });
        const { submitButton, canvas, onErrorMock, onSubmitMock } = setup;
        const input = /** @type {HTMLInputElement | null} */ (setup.input);
        if (!input) {
            throw new Error('Input element not found');
        }
        await step('Render the tel field.', () => {
            expect(canvas.getByText('Tel Field')).toBeTruthy();
        });

        await step('Submits form with invalid regex value: "some value".', () => {
            input.value = 'some value';
            submitButton?.click();
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.tel.errRegex'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = '0400124033';
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'tel-field': '0400124033' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextFieldStory;

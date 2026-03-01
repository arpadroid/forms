/**
 * @typedef {import('./textAreaField.js').default} TextAreaField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent, userEvent } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { getArgs, getArgTypes, playSetup, renderField } from '../field/field.stories.util.js';

/** @type {Meta} */
const TextAreaFieldStory = {
    title: 'Forms/Fields/Textarea',
    tags: [],
    render: (args, story) => renderField(args, story, 'textarea-field')
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...getArgTypes('Field Props')
    },
    args: {
        ...getArgs(),
        id: 'textarea-field',
        label: 'Textarea Field',
        required: true
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'textarea-field'
        });
        const { field, canvas, onErrorMock, onChangeMock, onSubmitMock } = setup;
        const input = /** @type {HTMLTextAreaElement | null} */ (setup.input);
        if (!input) throw new Error('Textarea input element not found');
        const submitButton = setup.submitButton;
        if (!submitButton) throw new Error('Submit button not found');

        await step('Submits empty required field and checks for error message', async () => {
            submitButton?.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.field.errRequired'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Types a value and receives onChange signal', async () => {
            await userEvent.type(input, 'some text');
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith('some text', field, expect.anything());
            });
        });

        await step('Submits form with valid field value.', async () => {
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'textarea-field': 'some text' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextAreaFieldStory;

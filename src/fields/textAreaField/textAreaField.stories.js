/**
 * @typedef {import('../field/field.types.js').FieldConfigType} FieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<FieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<FieldConfigType>} Story
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const TextAreaFieldStory = {
    title: 'Forms/Fields/Textarea',
    component: 'textarea-field',
    args: {
        id: 'textarea-field',
        label: 'Textarea Field',
        required: true
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <textarea-field ${$attr(args)}></textarea-field>
        </arpa-form>
    `
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    parameters: testParams,
    args: {
        ...Default.args,
        required: true
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { field, onErrorMock, onChangeMock, onSubmitMock, input, submitButton } = await playSetup({
            tag: 'textarea-field',
            canvas,
            canvasElement
        });

        await step('Submits empty required field and checks for error message', async () => {
            await userEvent.click(submitButton);
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
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'textarea-field': 'some text' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextAreaFieldStory;

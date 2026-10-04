/**
 * @typedef {import('../field/field.types').FieldConfigType} FieldConfigType
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
const UrlFieldStory = {
    title: 'Forms/Fields/Url',
    args: {
        id: 'url-field',
        label: 'URL Field',
        placeholder: 'Please enter a value',
        description: 'Test description',
        footnote: 'This is a footnote',
        tooltip: 'test tooltip',
        required: true
    },
    component: 'url-field',
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <url-field ${$attr(args)}></url-field>
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
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onErrorMock, onSubmitMock, input } = await playSetup({
            tag: 'url-field',
            canvas,
            canvasElement
        });

        await step('Submits form with invalid regex value "some value" and checks for error messages.', async () => {
            input.value = 'some value';
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.url.errUrl'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'https://www.example.com';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'url-field': 'https://www.example.com' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default UrlFieldStory;

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
const TelFieldStory = {
    title: 'Forms/Fields/Tel',
    component: 'tel-field',
    args: {
        id: 'tel-field',
        label: 'Tel Field',
        required: true,
        icon: 'phone',
        regex: 'telephone',
        regexMessage: I18n.getText('forms.fields.tel.errRegex')
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <tel-field ${$attr(args)}></tel-field>
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
        required: true,
        regex: 'telephone',
        regexMessage: I18n.getText('forms.fields.tel.errRegex')
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onErrorMock, onSubmitMock, input } = await playSetup({
            tag: 'tel-field',
            canvas,
            canvasElement
        });
        await step('Render the tel field.', () => {
            expect(canvas.getByText('Tel Field')).toBeTruthy();
        });

        await step('Submits form with invalid regex value: "some value".', async () => {
            input.value = 'some value';
            await userEvent.click(submitButton);
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
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'tel-field': '0400124033' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TelFieldStory;

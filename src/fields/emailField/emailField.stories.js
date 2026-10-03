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
const EmailFieldStory = {
    title: 'Forms/Fields/Email',
    component: 'email-field',
    args: {
        id: 'email-field',
        label: 'Email Field',
        icon: 'email',
        regex: 'email',
        regexMessage: I18n.getText('forms.fields.email.errRegex')
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <email-field ${$attr(args)}></email-field>
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
        required: true
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onErrorMock, onSubmitMock, input } = await playSetup({
            tag: 'email-field',
            canvas,
            canvasElement
        });
        await step('Submits form with invalid regex value "some value" and checks for error messages.', async () => {
            input.value = 'some value';
            await userEvent.click(submitButton);
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
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.email.errRegex'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(2);
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'email@somewhere.com';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'email-field': 'email@somewhere.com' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default EmailFieldStory;

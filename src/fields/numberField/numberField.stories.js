/**
 * @typedef {import('./numberField.types.js').NumberFieldConfigType} NumberFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<NumberFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<NumberFieldConfigType>} Story
 */

import { expect, waitFor, userEvent } from 'storybook/test';
import { I18n } from '@arpadroid/i18n';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const NumberFieldStory = {
    title: 'Forms/Fields/Number',
    component: 'number-field',
    args: {
        id: 'number-field',
        label: 'Number Field',
        required: true,
        icon: 'numbers',
        min: 0,
        max: 0,
        step: 1,
        enforceValue: false
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <number-field ${$attr(args)}></number-field>
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
        min: 10,
        max: 20,
        step: 2
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onErrorMock, onSubmitMock, input, field } = await playSetup({
            tag: 'number-field',
            canvas,
            canvasElement
        });
        await step('Submits form with invalid required value: "some value".', async () => {
            input.value = 'some value';
            await userEvent.click(submitButton);
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.field.errRequired'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with non-numeric error anf gets required error message', async () => {
            input.value = 'valid';
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errNumber'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with number below min and gets min error message.', async () => {
            input.value = '5';
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errMin', { min: '10' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with number above max and gets max error message.', async () => {
            input.value = '25';
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errMax', { max: '20' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with number not multiple of step and gets step error message.', async () => {
            input.value = '13';
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errStep', { step: '2' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = '18';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'number-field': 18 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step('Sets enforce value to true and submits form with value above max.', async () => {
            field.setAttribute('enforce-value', '');
            input.value = '25';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(input?.value).toBe('20');
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'number-field': 20 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step('Sets enforce value to true and submits form with value below min.', async () => {
            input.value = '5';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(input?.value).toBe('10');
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'number-field': 10 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default NumberFieldStory;

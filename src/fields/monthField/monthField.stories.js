/**
 * @typedef {import('../dateField/dateField.types.js').DateFieldConfigType} DateFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<DateFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<DateFieldConfigType>} Story
 */

import { expect, waitFor, userEvent } from 'storybook/test';
import { I18n } from '@arpadroid/i18n';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const MonthFieldStory = {
    title: 'Forms/Fields/Month',
    component: 'month-field',
    args: {
        id: 'month-field',
        label: 'Month Field',
        required: true,
        value: '12 June 2021',
        format: 'MMM YYYY',
        disablePast: false,
        disableFuture: false,
        min: '',
        max: ''
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <month-field ${$attr(args)}></month-field>
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
        value: '12 June 2021',
        format: 'MMM YYYY'
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onErrorMock, onSubmitMock, input, field } = await playSetup({
            tag: 'month-field',
            canvas,
            canvasElement
        });

        await step('Default value is OK.', async () => {
            expect(input?.value).toBe('2021-06');
        });

        await step('Sets values in date and string formats.', async () => {
            field.setValue('12 Dec 2026');
            expect(input?.value).toBe('2026-12');
            field.setValue(new Date('12 Jan 2028'));
            expect(input?.value).toBe('2028-01');
        });

        await step(
            'Disables past and future, submits form with invalid past and future dates and checks for error messages.',
            async () => {
                field.setAttribute('disable-past', 'true');
                field.setValue('31 Feb 1900');
                await userEvent.click(submitButton);
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.fields.date.errPastDisabled'));
                    canvas.getByText(I18n.getText('forms.form.msgError'));
                    expect(onErrorMock).toHaveBeenCalled();
                });

                field.setAttribute('disable-future', 'true');
                field.setValue('1 Jan 3000');
                await userEvent.click(submitButton);
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.fields.date.errFutureDisabled'));
                    canvas.getByText(I18n.getText('forms.form.msgError'));
                    expect(onErrorMock).toHaveBeenCalled();
                });
            }
        );

        await step('Submits form with different output formats and checks for expected submission values', async () => {
            field.setValue('1 October 1983');
            field.removeAttribute('disable-past');
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'month-field': 'Oct 1983' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
            field.setValue(new Date('17 July 1984'));
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'month-field': 'Jul 1984' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default MonthFieldStory;

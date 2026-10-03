/**
 * @typedef {import('./dateTimeField.types.js').DateTimeFieldConfigType} DateTimeFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<DateTimeFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<DateTimeFieldConfigType>} Story
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const DateTimeFieldStory = {
    title: 'Forms/Fields/DateTime',
    component: 'date-time-field',
    args: {
        id: 'date-time-field',
        label: 'Date Time Field',
        required: true,
        format: 'D MMM YYYY HH:MM',
        value: '12 June 2021 15:30'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <date-time-field ${$attr(args)}></date-time-field>
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
        const { submitButton, onSubmitMock, input, field } = await playSetup({
            tag: 'date-time-field',
            canvas,
            canvasElement
        });

        await step('Default value is OK.', async () => {
            expect(input?.value).toBe('2021-06-12T15:30');
        });

        await step('Sets values in date and string formats.', async () => {
            field.setValue('12 Dec 2026 12:30');
            expect(input?.value).toBe('2026-12-12T12:30');
            field.setValue(new Date('1/10/1983 12:30'));
            expect(input?.value).toBe('1983-01-10T12:30');
        });

        await step('Submits form with different output formats and checks for expected submission values', async () => {
            field.setValue('1 October 1983 12:30');
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'date-time-field': '1 Oct 1983 12:10' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default DateTimeFieldStory;

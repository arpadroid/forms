/**
 * @typedef {import('./timeField.types.js').TimeFieldConfigType} TimeFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<TimeFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<TimeFieldConfigType>} Story
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const TimeFieldStory = {
    title: 'Forms/Fields/Time',
    component: 'time-field',
    args: {
        id: 'time-field',
        label: 'Time Field',
        required: true,
        minLength: undefined,
        max: undefined
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <time-field ${$attr(args)}></time-field>
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
        value: '10:15',
        min: '12:01',
        max: '20:00'
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onErrorMock, onSubmitMock, input } = await playSetup({
            tag: 'time-field',
            canvas,
            canvasElement
        });

        await step('Renders the field with value "10:15".', () => {
            expect(canvas.getByText('Time Field')).toBeTruthy();
            expect(input?.value).toBe('10:15');
        });

        await step('Types invalid value and submits the form receiving error message.', async () => {
            input.value = 'invalid value';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.form.msgError'))).toBeTruthy();
            });
        });

        await step('Types time earlier than min value and receives expected error', async () => {
            input.value = '12:00';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.fields.time.errMin', { min: '12:01' }))).toBeTruthy();
                expect(canvas.getByText(I18n.getText('forms.form.msgError'))).toBeTruthy();
            });
        });

        await step('Types time after max value and receives expected error', async () => {
            input.value = '20:01';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.fields.time.errMax', { max: '20:00' }))).toBeTruthy();
                expect(canvas.getByText(I18n.getText('forms.form.msgError'))).toBeTruthy();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = '20:00';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'time-field': '20:00' });
                expect(canvas.getByText(I18n.getText('forms.form.msgSuccess'))).toBeTruthy();
            });
        });
    }
};

/** @type {Meta} */
export default TimeFieldStory;

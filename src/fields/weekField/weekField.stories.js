/**
 * @typedef {import('./weekField.types.js').WeekFieldConfigType} WeekFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<WeekFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<WeekFieldConfigType>} Story
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { playSetup } from '../field/field.stories';
import { $attr } from '@arpadroid/tools';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;

/** @type {Meta} */
const WeekFieldStory = {
    title: 'Forms/Fields/Week',
    tags: [],
    component: 'week-field',
    args: {
        id: 'week-field',
        label: 'Week Field',
        value: '2021-W01'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <week-field ${$attr(args)}></week-field>
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
        const { submitButton, onErrorMock, onSubmitMock, input } = await playSetup({
            tag: 'week-field',
            canvas,
            canvasElement
        });

        await step('Renders the field.', async () => {
            expect(canvas.getByText('Week Field')).toBeTruthy();
            expect(input?.value).toBe('2021-W01');
        });

        await step('Types invalid value and submits the form receiving error message.', async () => {
            await userEvent.clear(input);
            await userEvent.type(input, 'invalid value');
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                expect(onSubmitMock).not.toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
            });
        });

        await step('Types valid value and submits the form.', async () => {
            await userEvent.clear(input);
            await userEvent.type(input, '2021-W02');
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                expect(onSubmitMock).toHaveBeenCalledWith({
                    'week-field': '2021-W02'
                });
            });
        });
    }
};

/** @type {Meta} */
export default WeekFieldStory;

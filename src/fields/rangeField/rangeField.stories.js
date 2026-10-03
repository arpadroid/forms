/**
 * @typedef {import('./rangeField.types.js').RangeFieldConfigType} RangeFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<RangeFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<RangeFieldConfigType>} Story
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const RangeFieldStory = {
    title: 'Forms/Fields/Range',
    component: 'range-field',
    args: {
        id: 'range-field',
        label: 'Range Field',
        required: true,
        min: 0,
        max: 100,
        step: 1,
        value: 10
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <range-field ${$attr(args)}></range-field>
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
        value: 25
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onSubmitMock } = await playSetup({
            tag: 'range-field',
            canvas,
            canvasElement
        });

        await step('Submits form with valid field value.', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'range-field': 25 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default RangeFieldStory;

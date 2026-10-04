/**
 * @typedef {import('../field/field.types.js').FieldConfigType} FieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<FieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<FieldConfigType>} Story
 */

import { expect, waitFor, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { I18n } from '@arpadroid/i18n';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const HiddenFieldStory = {
    title: 'Forms/Fields/Hidden',
    component: 'hidden-field',
    args: {
        id: 'hidden-field',
        value: 'hidden value'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <hidden-field ${$attr(args)}></hidden-field>
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
        const { submitButton, onSubmitMock } = await playSetup({
            tag: 'hidden-field',
            canvas,
            canvasElement
        });
        await step('Submits form with field value.', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'hidden-field': 'hidden value' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default HiddenFieldStory;

/**
 * @typedef {import('../field/field.types.js').FieldConfigType} FieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<FieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<FieldConfigType>} Story
 */

import { expect, userEvent, waitFor } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { I18n } from '@arpadroid/i18n';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const ColorFieldStory = {
    title: 'Forms/Fields/Color',
    component: 'color-field',
    args: {
        id: 'color-field-test',
        label: 'Color Field',
        required: true,
        icon: 'color_lens'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <color-field ${$attr(args)}></color-field>
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
    args: {
        ...Default.args,
        id: 'color-field',
        required: true
    },
    parameters: testParams,
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'color-field',
            canvas,
            canvasElement
        });
        const { onErrorMock, onSubmitMock } = setup;
        const field = /** @type {import('./colorField').default} */ (setup.field);
        const textInput = /** @type {HTMLInputElement} */ (field.textInput);

        await step('sets value red to text input and checks that color input has appropriate value', async () => {
            await userEvent.type(textInput, 'red');
            await waitFor(() => expect(field.getValue()).toBe('#ff0000'));
        });

        await step('Sets invalid value and checks for error message', async () => {
            textInput.value = 'invalid';
            onErrorMock.mockReset();
            await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
            await waitFor(() => {
                canvas.getByText(field.i18nText('errColor'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
            });
            expect(onErrorMock).toHaveBeenCalled();
        });

        await step('Submits form with valid field value.', async () => {
            textInput.value = '';
            await userEvent.type(textInput, 'blue');
            await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'color-field': '#0000ff' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default ColorFieldStory;

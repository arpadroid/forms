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
const CheckboxFieldStory = {
    title: 'Forms/Fields/Checkbox',
    component: 'checkbox-field',
    args: {
        id: 'checkbox-field',
        label: 'Checkbox Field',
        required: false,
        value: 'option1, option2'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <checkbox-field ${$attr(args)}></checkbox-field>
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
        value: 'option1, option2'
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { field, submitButton, onErrorMock, onSubmitMock, onChangeMock, input } = await playSetup({
            tag: 'checkbox-field',
            inputSelector: 'input[type="checkbox"]',
            canvas,
            canvasElement
        });

        const label = canvas.getByText('Checkbox Field');

        await step('Renders the checkbox field.', async () => {
            expect(label).toBeTruthy();
            expect(input?.checked).toBe(false);
        });

        await step('Gets an error because the field is required.', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(onErrorMock).toHaveBeenCalledTimes(1);
                canvas.getByText(I18n.getText('forms.field.errRequired'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
            });
        });

        await step('Checks the checkbox', async () => {
            await userEvent.click(label);
            await waitFor(() => {
                expect(input?.checked).toBe(true);
                expect(onChangeMock).toHaveBeenLastCalledWith(true, field, expect.anything());
                expect(onChangeMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Submits the form and receives expected value.', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'checkbox-field': true });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default CheckboxFieldStory;

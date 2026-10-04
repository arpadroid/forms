/**
 * @typedef {import('../optionsField/optionsField.types.js').OptionsFieldConfigType} OptionsFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<OptionsFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<OptionsFieldConfigType>} Story
 */

import { waitFor, expect, userEvent } from 'storybook/test';
import { I18n } from '@arpadroid/i18n';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const RadioFieldStory = {
    title: 'Forms/Fields/Radio',
    component: 'radio-field',
    args: {
        id: 'radio-field',
        label: 'Radio field',
        required: true,
        value: 'option1'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <radio-field ${$attr(args)}>
                <radio-option value="option1" icon="rocket_launch">Option 1</radio-option>
                <radio-option value="option2" icon="eco">Option 2</radio-option>
                <radio-option value="option3" icon="star">Option 3</radio-option>
            </radio-field>
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
        id: 'radio-field-test',
        value: ''
    },
    play: async ({ canvasElement, step, canvas }) => {
        const setup = await playSetup({
            tag: 'radio-field',
            canvas,
            canvasElement
        });
        const { submitButton, onErrorMock, onSubmitMock, onChangeMock, field } = setup;

        await step('Renders the field with three radio options', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Radio field')).toBeInTheDocument();
                expect(canvas.getByText('Option 1')).toBeInTheDocument();
                expect(canvas.getByText('Option 2')).toBeInTheDocument();
                expect(canvas.getByText('Option 3')).toBeInTheDocument();
            });
        });

        await step('Submits the form without selecting a radio option', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Select the first radio option', async () => {
            const option2 = canvas.getByLabelText('Option 2');
            await userEvent.click(option2);
            await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith('option2', field, expect.anything()));
            expect(option2).toBeChecked();
        });

        await step('Submits the form with the selected radio option', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'radio-field-test': 'option2' });
            });
        });
    }
};

export default RadioFieldStory;

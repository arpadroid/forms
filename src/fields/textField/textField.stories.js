/** @typedef {import('../field/field.types').FieldConfigType} FieldConfigType */
/** @typedef {import('@storybook/web-components-vite').Meta<FieldConfigType>} Meta */
/** @typedef {import('@storybook/web-components-vite').StoryObj<FieldConfigType>} Story */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { playSetup } from '../field/field.stories';
import { testParams, defaultParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';

const html = String.raw;

/** @type {Meta} */
const TextFieldStory = {
    title: 'Forms/Fields/Text',
    tags: [],
    component: 'text-field',
    args: {
        regex: '^([a-z0-9]+)$',
        regexMessage: 'Only lowercase letters and numbers are allowed.',
        id: 'text-field',
        label: 'Text Field',
        labelIcon: 'label',
        tooltip: 'This is a text field.',
        icon: 'match_case',
        required: true
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <text-field ${$attr(args)}></text-field>
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

    play: async ({ canvasElement, step, canvas }) => {
        const setup = await playSetup({ canvas, canvasElement, tag: 'text-field' });
        const { submitButton, onErrorMock, onSubmitMock, input } = setup;

        await step('Submits form with invalid regex value: "some value".', async () => {
            await userEvent.type(input, 'some value');
            await userEvent.click(submitButton);
        });

        await step('Checks for error message.', async () => {
            canvas.getByText('Only lowercase letters and numbers are allowed.');
            canvas.getByText(I18n.getText('forms.form.msgError'));
            expect(onErrorMock).toHaveBeenCalled();
        });

        await step('Submits form with valid field value.', async () => {
            await userEvent.clear(input);
            await userEvent.type(input, 'valid');
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'text-field': 'valid' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default TextFieldStory;

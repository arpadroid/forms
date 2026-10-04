/**
 * @typedef {import('./selectField.types.js').SelectFieldConfigType} SelectFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<SelectFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<SelectFieldConfigType>} Story
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const SelectFieldStory = {
    title: 'Forms/Fields/Select',
    component: 'select-field',
    args: {
        id: 'select-field',
        label: 'Select field',
        required: true
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <select-field ${$attr(args)}>
                <option value="">Please select</option>
                <option value="volvo">Volvo</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
            </select-field>
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
        value: undefined
    },
    play: async ({ canvasElement, canvas, step }) => {
        const { submitButton, onErrorMock, onSubmitMock, onChangeMock, field, input } = await playSetup({
            tag: 'select-field',
            canvas,
            canvasElement
        });
        await step('Renders the field with four select options', async () => {
            expect(canvas.getByText('Select field')).toBeInTheDocument();
            expect(canvas.getByText('Volvo')).toBeInTheDocument();
            expect(canvas.getByText('Saab')).toBeInTheDocument();
            expect(canvas.getByText('Mercedes')).toBeInTheDocument();
            expect(canvas.getByText('Audi')).toBeInTheDocument();
        });

        await step('Submits the form without selecting an option and receives required error', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Selects the first option and submits the form', async () => {
            await userEvent.selectOptions(input, 'volvo');
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith('volvo', field, expect.anything());
            });
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'select-field': 'volvo' });
            });
        });
    }
};

export default SelectFieldStory;

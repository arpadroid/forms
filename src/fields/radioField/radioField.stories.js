/**
 * @typedef {import('./radioField.js').default} RadioField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { I18n } from '@arpadroid/i18n';
import { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect } from 'storybook/test';
import { getArgs, getArgTypes, playSetup, renderField, renderScript } from '../field/field.stories.util.js';

const html = String.raw;

function renderFieldContent() {
    return html`<radio-option value="option1" label="Option 1"></radio-option>
        <radio-option value="option2" label="Option 2"></radio-option>
        <radio-option value="option3" label="Option 3"></radio-option>`;
}

/** @type {Meta} */
const RadioFieldStory = {
    title: 'Forms/Fields/Radio',
    tags: [],
    render: (args, story) => renderField(args, story, 'radio-field', renderFieldContent, renderScript)
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...getArgTypes('Field Props') },
    args: {
        ...getArgs(),
        id: 'radio-field',
        label: 'Radio field',
        required: true,
        value: ''
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args
    },
    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'radio-field'
        });
        const { submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock } = setup;
        const field = /** @type {RadioField} */ (setup.field);

        await step('Renders the field with three radio options', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Radio field')).toBeInTheDocument();
                expect(canvas.getByText('Option 1')).toBeInTheDocument();
                expect(canvas.getByText('Option 2')).toBeInTheDocument();
                expect(canvas.getByText('Option 3')).toBeInTheDocument();
            });
        });

        await step('Submits the form without selecting a radio option', async () => {
            submitButton?.click();
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Select the first radio option', async () => {
            const options = field?.getOptions();
            // @ts-ignore
            options[1].input.click();
            await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith('option2', field, expect.anything()));
            // @ts-ignore
            expect(options[1].input).toBeChecked();
        });

        await step('Submits the form with the selected radio option', async () => {
            submitButton?.click();
            await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());
            expect(onSubmitMock).toHaveBeenCalledWith({ 'radio-field': 'option2' });
        });
    }
};

export default RadioFieldStory;

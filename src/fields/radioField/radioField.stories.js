/**
 * @typedef {import('./radioField.js').default} RadioField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { I18n } from '@arpadroid/i18n';
import { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, userEvent } from 'storybook/test';
import { getArgs, getArgTypes, playSetup, renderField, renderScript } from '../field/field.stories.util.js';

const html = String.raw;

/**
 * @returns {string}
 */
function renderFieldContent() {
    return html`<radio-option value="option1" label="Option 1"></radio-option>
        <radio-option value="option2" label="Option 2"></radio-option>
        <radio-option value="option3" label="Option 3"></radio-option>`;
}

/** @type {Meta} */
const RadioFieldStory = {
    title: 'Forms/Fields/Radio',
    tags: [],
    argTypes: { ...getArgTypes('Field Props') },
    args: {
        ...getArgs(),
        id: 'radio-field',
        label: 'Radio field',
        required: true,
        value: ''
    },
    render: (args, story) => renderField(args, story, 'radio-field', renderFieldContent, renderScript)
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        id: 'radio-field-test'
    },
    play: async ({ canvasElement, step, canvas }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'radio-field'
        });
        const { submitButton, onErrorMock, onSubmitMock } = setup;

        // const field = /** @type {RadioField} */ (setup.field);

        await step('Renders the field with three radio options', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Radio field')).toBeInTheDocument();
                expect(canvas.getByText('Option 1')).toBeInTheDocument();
                expect(canvas.getByText('Option 2')).toBeInTheDocument();
                expect(canvas.getByText('Option 3')).toBeInTheDocument();
            });
        });

        await step('Submits the form without selecting a radio option', async () => {
            submitButton && (await userEvent.click(submitButton));
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        await step('Select the first radio option', async () => {
            const option2 = canvas.getByLabelText('Option 2');
            await userEvent.click(option2);
            /** @todo Fix this. */
            // await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith('option2', field, expect.anything()));
            expect(option2).toBeChecked();
        });

        await step('Submits the form with the selected radio option', async () => {
            submitButton?.click();
            await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());
            expect(onSubmitMock).toHaveBeenCalledWith({ 'radio-field-test': 'option2' });
        });
    }
};

export default RadioFieldStory;

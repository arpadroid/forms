/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, fireEvent, waitFor } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { I18n } from '@arpadroid/i18n';

const html = String.raw;

/** @type {Meta} */
const CheckboxesFieldStory = {
    title: 'Forms/Fields/Checkboxes',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) =>
        FieldStory.render(args, story, 'checkboxes-field', CheckboxesFieldStory.renderFieldContent),
    renderFieldContent: () => html`
        <checkbox-option value="option1" label="Option 1" icon="grocery"></checkbox-option>
        <checkbox-option value="option2" label="Option 2" icon="nutrition"></checkbox-option>
        <checkbox-option value="option3" label="Option 3" icon="person"></checkbox-option>
    `
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        binary: {
            table: { category: 'Props' }
        },
        ...FieldDefault.argTypes
    },
    args: {
        binary: false,
        ...FieldDefault.defaultArgs,
        id: 'checkboxes-field',
        label: 'Checkboxes Field',
        value: 'option1, option2'
    }
};
delete Default.args.placeholder;
delete Default.argTypes.placeholder;

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        value: 'option1, option2'
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { field, submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock } = await FieldTest.playSetup(canvasElement);
        const label = canvas.getByText('Checkboxes Field');

        await step('Renders the checkboxes field with options.', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Option 1')).toBeTruthy();
                expect(canvas.getByText('Option 2')).toBeTruthy();
                expect(canvas.getByText('Option 3')).toBeTruthy();
            });
        });

        await step('Checks the field has the correct value', async () => {
            expect(field.hasValue('option1')).toBeTruthy();
            expect(field.hasValue('option2')).toBeTruthy();
            expect(field.hasValue('option3')).toBeFalsy();
        });

        await step('Clicks on the second option and unchecks it.', async () => {
            const option2 = canvas.getByText('Option 2');
            await fireEvent.click(option2);
            expect(field.hasValue('option2')).toBeFalsy();
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith(['option1'], field, expect.anything());
            });
        });

        await step('clicks on the label to toggle all options', async () => {
            await fireEvent.click(label);
            expect(field.hasValue('option1')).toBeTruthy();
            expect(field.hasValue('option2')).toBeTruthy();
            expect(field.hasValue('option3')).toBeTruthy();
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith(['option1', 'option2', 'option3'], field, undefined);
            });
            await fireEvent.click(label);
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith([], expect.anything(), undefined);
            });
        });

        await step('Submits form with invalid empty value and checks for error messages.', async () => {
            submitButton?.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.field.errRequired'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Submits form with valid field value.', async () => {
            await fireEvent.click(label);
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({
                    'checkboxes-field': ['option1', 'option2', 'option3']
                });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step('Switches to binary data mode, submits form and receives expected data.', async () => {
            field.setAttribute('binary', 'true');
            const option2 = canvas.getByText('Option 2');
            await fireEvent.click(option2);
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({
                    'checkboxes-field': {
                        option1: true,
                        option2: false,
                        option3: true
                    }
                });
            });
        });
    }
};

/** @type {Meta} */
export default CheckboxesFieldStory;

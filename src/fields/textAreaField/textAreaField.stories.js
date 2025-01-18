/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent, userEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const TextAreaFieldStory = {
    title: 'Forms/Fields/Textarea',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'textarea-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...FieldStory.getArgTypes('Field Props')
    },
    args: {
        ...FieldStory.getArgs(),
        id: 'textarea-field',
        label: 'Textarea Field',
        required: true
    }
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { field, input, submitButton, canvas, onErrorMock, onChangeMock, onSubmitMock } = setup;
        await step('Submits empty required field and checks for error message', async () => {
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.field.errRequired'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Types a value and receives onChange signal', async () => {
            await userEvent.type(input, 'some text');
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith('some text', field, expect.anything());
            });
        });

        await step('Submits form with valid field value.', async () => {
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'textarea-field': 'some text' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextAreaFieldStory;

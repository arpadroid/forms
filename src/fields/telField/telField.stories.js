/** @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const TextFieldStory = {
    title: 'Fields/Tel',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'tel-field')
};

// const category = 'Tel Field Props';
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...FieldStory.getArgTypes()
    },
    args: {
        ...FieldStory.getArgs(),
        id: 'tel-field',
        label: 'Tel Field',
        required: true
    }
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        regex: Default.args.regex,
        regexMessage: Default.args.regexMessage
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = setup;

        await step('Render the tel field.', () => {
            expect(canvas.getByText('Tel Field')).toBeTruthy();
        });

        await step('Submits form with invalid regex value: "some value".', () => {
            input.value = 'some value';
            submitButton.click();
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.tel.errRegex'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = '0400124033';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'tel-field': '0400124033' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextFieldStory;

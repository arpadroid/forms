/** @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const TextFieldStory = {
    title: 'Fields/Text',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'text-field')
};

const category = 'Text Field Props';
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        regex: { table: { category } },
        regexMessage: { table: { category } },
        ...FieldStory.getArgTypes()
    },
    args: {
        regex: '^([a-z0-9]+)$',
        regexMessage: 'Only lowercase letters and numbers are allowed.',
        ...FieldStory.getArgs(),
        id: 'text-field',
        label: 'Text Field',
        icon: 'match_case',
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

        await step('Submits form with invalid regex value: "some value".', () => {
            input.value = 'some value';
            submitButton.click();
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText('Only lowercase letters and numbers are allowed.');
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'valid';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'text-field': 'valid' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextFieldStory;

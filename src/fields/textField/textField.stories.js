/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const TextFieldStory = {
    title: 'Fields/Text',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'text-field')
};

export const Default = {
    name: 'Render',
    /** @type {FieldInterface} */
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        regex: {
            table: { category: 'Props' }
        },
        regexMessage: {
            table: { category: 'Props' }
        },
        ...FieldDefault.argTypes
    },
    args: {
        regex: '^([a-z0-9]+)$',
        regexMessage: 'Only lowercase letters and numbers are allowed.',
        ...FieldDefault.args,
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
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = await FieldTest.playSetup(canvasElement);

        await step('Submits form with invalid regex value: "some value".', () => {
            input.value = 'some value';
            submitButton.click();
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText('Only lowercase letters and numbers are allowed.');
                canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'valid';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'text-field': 'valid' });
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
            });
        });
    }
};

export default TextFieldStory;

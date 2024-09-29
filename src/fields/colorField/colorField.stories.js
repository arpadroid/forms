import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent, userEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const ColorFieldStory = {
    title: 'Fields/Color',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'color-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...FieldStory.getArgTypes('Field Props')
    },
    args: {
        ...FieldStory.getArgs(),
        id: 'color-field-test',
        label: 'Color Field',
        required: true
    }
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        id: 'color-field',
        required: true
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { submitButton, canvas, onErrorMock, form, onSubmitMock, field } = setup;
        const textInput = field.textInput;
        await step('sets value red to text input and checks that color input has appropriate value', async () => {
            await userEvent.type(textInput, 'red');
            await waitFor(() => expect(field.getValue()).toBe('#ff0000'));
        });

        await step('Sets invalid value and checks for error message', async () => {
            textInput.value = 'invalid';
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(field.i18nText('errColor'));
                canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
            });
            expect(onErrorMock).toHaveBeenCalledOnce();
        });

        await step('Submits form with valid field value.', async () => {
            textInput.value = '';
            await userEvent.type(textInput, 'blue');
            await fireEvent.submit(form);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'color-field': '#0000ff' });
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
            });
        });
    }
};

export default ColorFieldStory;

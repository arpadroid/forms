import { I18n } from '@arpadroid/i18n';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, fireEvent } from '@storybook/test';

const CheckboxFieldStory = {
    title: 'Fields/Checkbox',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'checkbox-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...FieldStory.getArgTypes() },
    args: {
        ...FieldStory.getArgs(),
        icon: 'check_box',
        id: 'checkbox-field',
        label: 'Checkbox Field'
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        value: 'option1, option2'
    },
    play: async ({ canvasElement, step }) => {
        const { field, submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock, input } =
            await FieldTest.playSetup(canvasElement);

        const label = canvas.getByText('Checkbox Field');
        const icon = canvas.getByText('check_box');

        await step('Renders the checkbox field.', async () => {
            expect(label).toBeTruthy();
            expect(icon).toBeTruthy();
            expect(input.checked).toBe(false);
        });

        await step('Gets an error because the field is required.', async () => {
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(onErrorMock).toHaveBeenCalledTimes(1);
                canvas.getByText(I18n.getText('modules.form.field.errRequired'));
                canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
            });
        });

        await step('Checks the checkbox', async () => {
            fireEvent.click(label);
            expect(input.checked).toBe(true);
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith(true, field);
                expect(onChangeMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Submits the form and receives expected value.', async () => {
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'checkbox-field': true });
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
            });
        });
    }
};

export default CheckboxFieldStory;

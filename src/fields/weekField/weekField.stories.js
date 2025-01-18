import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const WeekFieldStory = {
    title: 'Forms/Fields/Week',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'week-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...FieldStory.getArgTypes() },
    args: {
        ...FieldStory.getArgs(),
        id: 'week-field',
        label: 'Week Field',
        value: '2021-W01'
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async ({ canvasElement, step }) => {
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = await FieldTest.playSetup(canvasElement);

        await step('Renders the field.', async () => {
            expect(canvas.getByText('Week Field')).toBeTruthy();
            expect(input.value).toBe('2021-W01');
        });

        await step('Types invalid value and submits the form receiving error message.', async () => {
            input.value = 'invalid value';
            submitButton.click();
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                expect(onSubmitMock).not.toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
            });
        });

        await step('Types valid value and submits the form.', async () => {
            input.value = '2021-W02';
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                expect(onSubmitMock).toHaveBeenCalledWith({
                    'week-field': '2021-W02'
                });
            });
        });
    }
};

export default WeekFieldStory;

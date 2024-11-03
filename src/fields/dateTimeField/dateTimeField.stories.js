import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { Default as DateDefault } from '../dateField/dateField.stories.js';

const DateFieldStory = {
    title: 'Fields/DateTime',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'date-time-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...DateDefault.argTypes
    },
    args: {
        ...DateDefault.args,
        id: 'date-time-field',
        value: '12 June 2021 15:30',
        format: 'D MMM YYYY HH:MM'
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
    },
    play: async ({ canvasElement, step }) => {
        const { submitButton, canvas, onSubmitMock, field, input } = await FieldTest.playSetup(canvasElement);

        await step('Default value is OK.', async () => {
            expect(input.value).toBe('2021-06-12T15:30');
        });

        await step('Sets values in date and string formats.', async () => {
            field.setValue('12 Dec 2026 12:30');
            expect(input.value).toBe('2026-12-12T12:30');
            field.setValue(new Date('1/10/1983 12:30'));
            expect(input.value).toBe('1983-01-10T12:30');
        });

        await step('Submits form with different output formats and checks for expected submission values', async () => {
            field.setValue('1 October 1983 12:30');
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'date-time-field': '1 Oct 1983 12:10' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default DateFieldStory;

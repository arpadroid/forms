/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import DateFieldStory from '../dateField/dateField.stories.js';

const MonthFieldStory = {
    title: 'Fields/Month',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'month-field')
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...DateFieldStory.getArgTypes()
    },
    args: {
        ...DateFieldStory.getArgs(),
        id: 'month-field',
        label: 'Month Field',
        required: true
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        value: '12 June 2021',
        format: 'MMM YYYY'
    },
    play: async ({ canvasElement, step }) => {
        const { submitButton, canvas, onErrorMock, onSubmitMock, field, input } = await FieldTest.playSetup(canvasElement);
        
        await step('Default value is OK.', async () => {
            expect(input.value).toBe('2021-06');
        });

        await step('Sets values in date and string formats.', async () => {
            field.setValue('12 Dec 2026');
            expect(input.value).toBe('2026-12');
            field.setValue(new Date('12 Jan 2028'));
            expect(input.value).toBe('2028-01');
        });

        await step(
            'Disables past and future, submits form with invalid past and future dates and checks for error messages.',
            async () => {
                field.setAttribute('disable-past', true);
                field.setValue('31 Feb 1900');
                submitButton.click();
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.fields.date.errPastDisabled'));
                    canvas.getByText(I18n.getText('forms.form.msgError'));
                    expect(onErrorMock).toHaveBeenCalled();
                });

                field.setAttribute('disable-future', true);
                field.setValue('1 Jan 3000');
                submitButton.click();
                await waitFor(() => {
                    canvas.getByText(I18n.getText('forms.fields.date.errFutureDisabled'));
                    canvas.getByText(I18n.getText('forms.form.msgError'));
                    expect(onErrorMock).toHaveBeenCalled();
                });
            }
        );

        await step('Submits form with different output formats and checks for expected submission values', async () => {
            field.setValue('1 October 1983');
            field.removeAttribute('disable-past');
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'month-field': 'Oct 1983' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
            field.setValue(new Date('17 July 1984'));
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'month-field': 'Jul 1984' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default MonthFieldStory;

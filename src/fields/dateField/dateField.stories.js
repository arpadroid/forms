/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
const category = 'Date Field Props';
const DateFieldStory = {
    title: 'Fields/Date',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'date-field'),
    getArgTypes: () => {
        return {
            format: {
                table: { category }
            },
            disablePast: {
                table: { category }
            },
            disableFuture: {
                table: { category }
            },
            min: {
                control: { type: 'text' },
                table: { category }
            },
            max: {
                control: { type: 'text' },
                table: { category }
            },
            ...FieldStory.getArgTypes('Field Props')
        };
    },
    getArgs: () => {
        return {
            disablePast: false,
            disableFuture: false,
            min: '',
            max: '',
            ...FieldStory.getArgs(),
            id: 'date-field',
            label: 'Date Field',
            required: true
        };
    }
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: DateFieldStory.getArgTypes(),
    args: {
        format: 'D MMM YYYY',
        ...DateFieldStory.getArgs()
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        value: '12 June 2021'
    },
    play: async ({ canvasElement, step }) => {
        const { submitButton, canvas, onErrorMock, onSubmitMock, field, input } = await FieldTest.playSetup(canvasElement);

        await step('Default value is OK.', async () => {
            expect(input.value).toBe('2021-06-12');
        });

        await step('Sets values in date and string formats.', async () => {
            field.setValue('12 Dec 2026');
            expect(input.value).toBe('2026-12-12');
            field.setValue(new Date('12 Jan 2028'));
            expect(input.value).toBe('2028-01-12');
        });

        await step('Submits form with different output formats and checks for expected submission values', async () => {
            field.setValue('1 October 1983');
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'date-field': '1 Oct 1983' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
            field.setValue(new Date('17 July 1984'));
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'date-field': '17 Jul 1984' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
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

        await step('Sets min and max and checks for error messages accordingly', async () => {
            field.removeAttribute('disable-past');
            field.removeAttribute('disable-future');
            field.setAttribute('min', '1 Jan 2000');
            field.setAttribute('max', '31 Dec 2020');
            field.setValue('1 Jan 1999');
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.date.errMinDate', { date: '1 Jan 2000' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });

            field.setValue('31 Dec 2021');
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.date.errMaxDate', { date: '31 Dec 2020' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            field.setValue(new Date('30 December 2020'));
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'date-field': '30 Dec 2020' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default DateFieldStory;

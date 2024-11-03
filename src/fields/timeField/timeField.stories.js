/** @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

const TimeFieldStory = {
    title: 'Fields/Time',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'time-field')
};

const category = 'Time Field Props';
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        min: {
            control: { type: 'text' },
            table: { category }
        },
        max: {
            control: { type: 'text' },
            table: { category }
        },
        ...FieldStory.getArgTypes()
    },
    args: {
        min: undefined,
        max: undefined,
        ...FieldStory.getArgs(),
        id: 'time-field',
        label: 'Time Field',
        required: true
    }
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        value: '10:15',
        min: '12:01',
        max: '20:00'
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = setup;
        const msgErrorKey = 'forms.form.msgError';
        await step('Renders the field with value "10:15".', () => {
            expect(canvas.getByText('Time Field')).toBeTruthy();
            expect(input.value).toBe('10:15');
        });

        await step('Types invalid value and submits the form receiving error message.', async () => {
            input.value = 'invalid value';
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText(msgErrorKey))).toBeTruthy();
            });
        });

        await step('Types time earlier than min value and receives expected error', async () => {
            input.value = '12:00';
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.fields.time.errMin', { min: '12:01' }))).toBeTruthy();
                expect(canvas.getByText(I18n.getText(msgErrorKey))).toBeTruthy();
            });
        });

        await step('Types time after max value and receives expected error', async () => {
            input.value = '20:01';
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).not.toHaveBeenCalled();
                expect(canvas.getByText(I18n.getText('forms.fields.time.errMax', { max: '20:00' }))).toBeTruthy();
                expect(canvas.getByText(I18n.getText(msgErrorKey))).toBeTruthy();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = '20:00';
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'time-field': '20:00' });
                expect(canvas.getByText(I18n.getText('forms.form.msgSuccess'))).toBeTruthy();
            });
        });
    }
};

export default TimeFieldStory;

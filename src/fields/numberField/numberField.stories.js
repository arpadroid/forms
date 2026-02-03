/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, fireEvent, waitFor } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { I18n } from '@arpadroid/i18n';

const html = String.raw;

/** @type {Meta} */
const NumberFieldStory = {
    title: 'Forms/Fields/Number',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) => FieldStory.render(args, story, 'number-field')
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        step: {
            control: { type: 'number' },
            table: { category: 'Props' }
        },
        min: {
            control: { type: 'number' },
            table: { category: 'Props' }
        },
        max: {
            control: { type: 'number' },
            table: { category: 'Props' }
        },
        ...FieldStory.getArgTypes()
    },
    args: {
        step: 1,
        min: 0,
        max: 0,
        ...FieldStory.getArgs(),
        id: 'number-field',
        label: 'Number Field',
        required: true
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        min: 10,
        max: 20,
        step: 2
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { input, submitButton, canvas, onErrorMock, onSubmitMock, field } = await FieldTest.playSetup(canvasElement);

        await step('Submits form with invalid regex value: "some value".', () => {
            input.value = 'some value';
            submitButton?.click();
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.field.errRequired'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with non-numeric error anf gets required error message', async () => {
            input.value = 'valid';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errNumber'));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with number below min and gets min error message.', async () => {
            input.value = '5';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errMin', { min: '10' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with number above max and gets max error message.', async () => {
            input.value = '25';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errMax', { max: '20' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with number not multiple of step and gets step error message.', async () => {
            input.value = '13';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.fields.number.errStep', { step: '2' }));
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = '18';
            await fireEvent.input(input);
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'number-field': 18 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step('Sets enforce value to true and submits form with value above max.', async () => {
            field.setAttribute('enforce-value', '');
            input.value = '25';
            await fireEvent.input(input);
            submitButton?.click();
            await waitFor(() => {
                expect(input?.value).toBe('20');
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'number-field': 20 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step('Sets enforce value to true and submits form with value below min.', async () => {
            input.value = '5';
            await fireEvent.input(input);
            submitButton?.click();
            await waitFor(() => {
                expect(input?.value).toBe('10');
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'number-field': 10 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default NumberFieldStory;

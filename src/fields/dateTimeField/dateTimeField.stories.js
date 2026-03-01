/**
 * @typedef {import('./dateTimeField.js').default} DateTimeField
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { Default as DateDefault } from '../dateField/dateField.stories.js';
import { playSetup, renderField } from '../field/field.stories.util.js';

/** @type {Meta} */
const DateFieldStory = {
    title: 'Forms/Fields/DateTime',
    tags: [],
    render: (args, story) => renderField(args, story, 'date-time-field')
};

/** @type {StoryObj} */
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

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'date-time-field'
        });
        const { submitButton, canvas, onSubmitMock } = setup;
        const field = /** @type {DateTimeField} */ (setup.field);
        const input = /** @type {HTMLInputElement} */ (setup.input);

        await step('Default value is OK.', async () => {
            expect(input?.value).toBe('2021-06-12T15:30');
        });

        await step('Sets values in date and string formats.', async () => {
            field.setValue('12 Dec 2026 12:30');
            expect(input?.value).toBe('2026-12-12T12:30');
            field.setValue(new Date('1/10/1983 12:30'));
            expect(input?.value).toBe('1983-01-10T12:30');
        });

        await step('Submits form with different output formats and checks for expected submission values', async () => {
            field.setValue('1 October 1983 12:30');
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'date-time-field': '1 Oct 1983 12:10' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default DateFieldStory;

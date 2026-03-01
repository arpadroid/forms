/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('../field/field.types').FieldConfigType} FieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { getArgs, getArgTypes, playSetup, renderField } from '../field/field.stories.util.js';

/** @type {Meta} */
const RangeFieldStory = {
    title: 'Forms/Fields/Range',
    tags: [],
    render: (args, story) => renderField(args, story, 'range-field')
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        min: {
            control: 'number',
            table: { category: 'Range Props' }
        },
        max: {
            control: 'number',
            table: { category: 'Range Props' }
        },
        step: {
            control: 'number',
            table: { category: 'Range Props' }
        },
        ...getArgTypes('Field Props')
    },
    args: {
        min: '0',
        max: 100,
        step: 1,
        ...getArgs(),
        id: 'range-field',
        label: 'Range Field',
        required: true,
        value: undefined
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        value: 25
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { submitButton, canvas, onSubmitMock } = await playSetup(canvasElement, {
            fieldTag: 'range-field'
        });

        await step('Submits form with valid field value.', async () => {
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'range-field': 25 });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default RangeFieldStory;

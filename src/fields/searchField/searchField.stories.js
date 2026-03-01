/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('../field/field.types').FieldConfigType} FieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from 'storybook/test';
import { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { getArgs, getArgTypes, playSetup, renderField } from '../field/field.stories.util.js';

/** @type {Meta} */
const SearchFieldStory = {
    title: 'Forms/Fields/Search',
    tags: [],
    render: (args, story) => renderField(args, story, 'search-field')
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...getArgTypes()
    },
    args: {
        ...getArgs(),
        id: 'search-field',
        label: 'Search Field'
    }
};

/** @type {StoryObj} */
export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'search-field'
        });
        const { canvas, onSubmitMock } = setup;
        const input = /** @type {HTMLInputElement} */ (setup.input);
        const submitButton = /** @type {HTMLButtonElement} */ (setup.submitButton);

        await step('Renders the field', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Search Field')).toBeInTheDocument();
                expect(input).toHaveAttribute('placeholder', I18n.getText('common.labels.lblSearch'));
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'some query';
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'search-field': 'some query' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default SearchFieldStory;

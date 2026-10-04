/**
 * @typedef {import('../field/field.types.js').FieldConfigType} FieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<FieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<FieldConfigType>} Story
 */

import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const SearchFieldStory = {
    title: 'Forms/Fields/Search',
    component: 'search-field',
    args: {
        id: 'search-field',
        label: 'Search Field'
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <search-field ${$attr(args)}></search-field>
        </arpa-form>
    `
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    parameters: testParams,
    args: { ...Default.args },
    play: async ({ canvasElement, canvas, step }) => {
        const { onSubmitMock, input, submitButton } = await playSetup({
            tag: 'search-field',
            canvas,
            canvasElement
        });

        await step('Renders the field', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Search Field')).toBeInTheDocument();
                expect(input).toHaveAttribute('placeholder', I18n.getText('common.labels.lblSearch'));
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'some query';
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'search-field': 'some query' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default SearchFieldStory;

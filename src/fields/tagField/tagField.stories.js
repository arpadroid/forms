/**
 * @typedef {import('./tagField.types.js').TagFieldConfigType} TagFieldConfigType
 * @typedef {import('./tagField.js').default} TagField
 * @typedef {import('@storybook/web-components-vite').Meta<TagFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<TagFieldConfigType>} Story
 */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, userEvent, fn } from 'storybook/test';
import { queryPeople } from '../../demo/demoFormOptions.js';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const TagFieldStory = {
    title: 'Forms/Fields/Tag',
    component: 'tag-field',
    args: {
        id: 'tag-field',
        label: 'Tag field',
        required: true,
        allowText: true,
        hasSearch: false,
        value: 'IS-N::Isaac Newton, AB-E::Albert Einstein'
    },
    play: async ({ canvasElement, canvas }) => {
        const setup = await playSetup({
            tag: 'tag-field',
            canvas,
            canvasElement
        });
        const field = /** @type {TagField} */ (setup.field);
        await field?.promise;
        field?.setFetchOptions(queryPeople);
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <tag-field ${$attr(args)}></tag-field>
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
    args: {
        ...Default.args,
        value: 'IS-N::Isaac Newton, AB-E::Albert Einstein',
        debounceSearch: 1
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'tag-field',
            canvas,
            canvasElement
        });

        const { onErrorMock, onChangeMock } = setup;
        const input = /** @type {HTMLInputElement | null} */ (setup.input);
        const field = /** @type {TagField} */ (setup.field);
        const submitButton = /** @type {HTMLButtonElement | null} */ (setup.submitButton);
        const onSubmitMock = setup.onSubmitMock;

        if (!input) throw new Error('Input element not found in the setup.');
        if (!field) throw new Error('Field not found in the setup.');
        if (!submitButton) throw new Error('Submit button not found in the setup.');
        field.inputCombo?.close();

        await field.promise;
        field.setFetchOptions(queryPeople);
        const onDeleteTag = fn();
        field.on('deleteTag', onDeleteTag);
        await step('Renders tags as per field value.', async () => {
            await waitFor(() => {
                expect(canvas.getByText('Tag field')).toBeInTheDocument();
                const tag = canvas.getByText('Albert Einstein').closest('tag-item');
                expect(tag).toHaveAttribute('value', 'AB-E');
                const tag2 = canvas.getByText('Isaac Newton').closest('tag-item');
                expect(tag2).toHaveAttribute('value', 'IS-N');
                expect(field.getValue()).toEqual(['IS-N', 'AB-E']);
            });
        });

        await step('Deletes the existing tags and checks empty content is rendered.', async () => {
            const tag = canvasElement.querySelector('tag-item[value="IS-N"]');
            const tag2 = canvasElement.querySelector('tag-item[value="AB-E"]');
            const deleteButtons = canvas.getAllByRole('button', { name: 'Delete tag' });
            await userEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(onDeleteTag).toHaveBeenLastCalledWith(tag, undefined, undefined);
                expect(field.getValue()).toEqual(['AB-E']);
            });
            await userEvent.click(deleteButtons[1]);
            await waitFor(() => {
                expect(onDeleteTag).toHaveBeenLastCalledWith(tag2, undefined, undefined);
                expect(field.getValue()).toEqual([]);
            });
            await waitFor(() => {
                expect(input).toHaveAttribute('placeholder', I18n.getText('forms.fields.tag.lblSearchTags'));
            });
        });

        await step('Submits the form and receives required error.', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Performs search and verifies search results', async () => {
            await userEvent.type(input, 'and', { delay: 100 });
            const combo = field?.inputCombo?.combo;

            await waitFor(() => {
                expect(combo?.querySelector('[value="NE-B"')).toBeInTheDocument();
                expect(combo?.querySelector('[value="NE-AU"')).toBeInTheDocument();
                expect(combo?.querySelector('[value="NE-CN"')).toBeInTheDocument();
            });
        });

        await step('Selects tag and submits the form receiving expected values.', async () => {
            const button = document.querySelector('[value="NE-AU"] button');
            button && (await userEvent.click(button));
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith(['NE-AU'], field, expect.anything());
            });
            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(canvas.getByText(I18n.getText('forms.form.msgSuccess'))).toBeVisible();
                expect(onSubmitMock).toHaveBeenCalledWith({ 'tag-field': ['NE-AU'] });
            });
        });
    }
};

/** @type {Meta} */
export default TagFieldStory;

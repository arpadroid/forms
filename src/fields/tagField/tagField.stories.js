/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./tagField.js').default} TagField
 */
import { I18n } from '@arpadroid/i18n';
import { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, userEvent, fn, fireEvent } from 'storybook/test';
import { queryPeople } from '../../demo/demoFormOptions.js';
import { getArgs, getArgTypes, playSetup } from '../field/field.stories.util.js';
import { $attr } from '@arpadroid/tools';

const html = String.raw;

/** @type {Meta} */
const TagFieldStory = {
    title: 'Forms/Fields/Tag',
    tags: [],
    play: async ({ canvasElement }) => {
        const setup = await playSetup(canvasElement);
        const field = /** @type {TagField} */ (setup.field);
        await field?.promise;
        field?.setFetchOptions(queryPeople);
    },
    render: args => {
        return html`
            <arpa-form id="field-form">
                <tag-field ${$attr(args)}> </tag-field>
            </arpa-form>
        `;
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        allowText: { control: 'boolean', table: { category: 'Tag Field Props' } },
        hasSearch: { control: 'boolean', table: { category: 'Tag Field Props' } },
        ...getArgTypes('Field Props')
    },
    args: {
        allowText: true,
        hasSearch: false,
        ...getArgs(),
        id: 'tag-field',
        label: 'Tag field',
        required: true,
        value: 'IS-N::Isaac Newton, AB-E::Albert Einstein'
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        value: 'IS-N::Isaac Newton, AB-E::Albert Einstein',
        debounceSearch: 1
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'tag-field'
        });

        const { canvas, onErrorMock, onChangeMock } = setup;
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
            await fireEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(onDeleteTag).toHaveBeenLastCalledWith(tag, undefined, undefined);
                expect(field.getValue()).toEqual(['AB-E']);
            });
            await fireEvent.click(deleteButtons[1]);
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
            button && await userEvent.click(button);
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

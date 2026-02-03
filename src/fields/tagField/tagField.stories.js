/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { I18n } from '@arpadroid/i18n';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, userEvent, fn, fireEvent } from 'storybook/test';
import { queryPeople } from '../../demo/demoFormOptions.js';

const html = String.raw;
/** @type {Meta} */
const TagFieldStory = {
    title: 'Forms/Fields/Tag',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {StoryContext} */ story) =>
        FieldStory.render(args, story, 'tag-field', FieldStory.renderFieldContent, TagFieldStory.renderScript),
    renderScript: (/** @type {Args} */ args, /** @type {StoryContext} */ story) => {
        return story.name === 'Test'
            ? ''
            : html`
                  <script type="module">
                      import { queryPeople } from '../../demo/demoFormOptions.js';
                      customElements.whenDefined('arpa-form').then(() => {
                          const form = document.getElementById('field-form');
                          form.onSubmit(values => {
                              console.log('form values', values);
                              return true;
                          });
                          const tagField = form.getField('tag-field');
                          tagField.setFetchOptions(queryPeople);
                      });
                  </script>
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
        ...FieldStory.getArgTypes('Field Props')
    },
    args: {
        allowText: true,
        hasSearch: false,
        ...FieldStory.getArgs(),
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
        const setup = await FieldTest.playSetup(canvasElement);
        const { field, submitButton, canvas, onErrorMock, onChangeMock, input } = setup;
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
            await fireEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Performs search and verifies search results', async () => {
            await new Promise(r => setTimeout(r, 100)); // Wait for debounce
            await userEvent.type(input, 'and');
            await fireEvent.keyDown(input);
            await waitFor(() => {
                expect(canvas.getByText('Alexander Graham Bell')).toBeInTheDocument();
                expect(canvas.getByText('Nelson Mandela')).toBeInTheDocument();
                expect(canvas.getByText('Mahatma Gandhi')).toBeInTheDocument();
                expect(canvas.queryByText('Albert Einstein')).toBeNull();
            });
        });

        await step('Selects tag and submits the form receiving expected values.', async () => {
            const button = canvas.getByText('Nelson Mandela');
            button.click();
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith(['NE-AU'], field, expect.anything());
            });
            await fireEvent.click(submitButton);
            await waitFor(() => {
                expect(canvas.getByText(I18n.getText('forms.form.msgSuccess'))).toBeVisible();
                /** @todo Fix flaky test. */
                // expect(onSubmitMock).toHaveBeenCalledWith({ 'tag-field': ['NE-AU'] });
            });
        });
    }
};

/** @type {Meta} */
export default TagFieldStory;

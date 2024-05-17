import { I18n } from '@arpadroid/i18n';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, userEvent, fn, fireEvent } from '@storybook/test';
import { queryPeople } from '../../demo/demoFormOptions.js';

const html = String.raw;
const TagFieldStory = {
    title: 'Fields/Tag',
    tags: [],
    render: (args, story) =>
        FieldStory.render(args, story, 'tag-field', FieldStory.renderFieldContent, TagFieldStory.renderScript),
    renderScript: (args, story) => {
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
        required: true
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        value: 'IS-N::Isaac Newton, AB-E::Albert Einstein',
        debounceSearch: 1
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { field, submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock, input } = setup;
        field.setFetchOptions(queryPeople);
        const onDeleteTag = fn();
        field.listen('onDeleteTag', onDeleteTag);
        await step('Renders tags as per field value.', async () => {
            expect(canvas.getByText('Tag field')).toBeInTheDocument();
            await waitFor(() => {
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
            const deleteButtons = canvas.getAllByRole('button', { name: 'Delete' });

            userEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(onDeleteTag).toHaveBeenLastCalledWith(tag, undefined);
                expect(field.getValue()).toEqual(['AB-E']);
            });
            userEvent.click(deleteButtons[1]);
            await waitFor(() => {
                expect(onDeleteTag).toHaveBeenLastCalledWith(tag2, undefined);
                expect(field.getValue()).toEqual([]);
            });
            await waitFor(() => {
                expect(input).toHaveAttribute('placeholder', I18n.getText('modules.form.fields.tag.lblSearchTags'));
            });
        });

        await step('Submits the form and receives required error.', async () => {
            userEvent.click(submitButton);
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
                canvas.getByText(I18n.getText('modules.form.field.errRequired'));
            });
        });

        await step('Performs search and verifies search results', async () => {
            await userEvent.type(input, 'and');
            await waitFor(() => {
                expect(canvas.getByText('Alexander Graham Bell')).toBeVisible();
                expect(canvas.getByText('Nelson Mandela')).toBeVisible();
                expect(canvas.getByText('Mahatma Gandhi')).toBeVisible();
                expect(canvas.queryByText('Albert Einstein')).toBeNull();
            });
        });

        await step('Selects tag and submits the form receiving expected values.', async () => {
            await userEvent.click(canvas.getByText('Nelson Mandela'));
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith(['NE-AU'], field);
            });
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'))).toBeVisible();
                expect(onSubmitMock).toHaveBeenCalledWith({ 'tag-field': ['NE-AU'] });
            });
        });
    }
};

export default TagFieldStory;

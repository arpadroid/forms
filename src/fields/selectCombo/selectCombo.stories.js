import { I18n } from '@arpadroid/i18n';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, userEvent, fireEvent } from '@storybook/test';
import { CountryOptions } from '../../demo/demoFormOptions.js';

const html = String.raw;
const SelectComboStory = {
    title: 'Fields/SelectCombo',
    tags: [],
    render: (args, story) =>
        FieldStory.render(args, story, 'select-combo', FieldStory.renderFieldContent, SelectComboStory.renderScript),
    renderScript: (args, story) => {
        return story.name === 'Test'
            ? ''
            : html`
                  <script type="module">
                      // We are going to set many options to the select combo field, therefore we'll do so programmatically.
                      import { CountryOptions } from '../../demo/demoFormOptions.js';
                      customElements.whenDefined('arpa-form').then(() => {
                          const form = document.getElementById('field-form');
                          const selectCombo = form.getField('select-combo');
                          selectCombo.setOptions(CountryOptions);
                          form.onSubmit(values => {
                              console.log('values2', values);
                              return true;
                          });
                      });
                  </script>
              `;
    }
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        hasSearch: { control: 'boolean', table: { category: 'Select Combo Props' } },
        debounceSearch: { control: 'number', table: { category: 'Select Combo Props' } },
        ...FieldStory.getArgTypes('Field Props')
    },
    args: {
        hasSearch: false,
        ...FieldStory.getArgs(),
        id: 'select-combo',
        label: 'Select combo',
        required: true
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        value: undefined,
        options: CountryOptions,
        debounceSearch: 1
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { field, submitButton, canvas, onErrorMock, onChangeMock } = setup;
        let { input } = setup;
        field.setOptions(CountryOptions);
        await step('Renders the field with four select options', async () => {
            expect(canvas.getByText('Select combo')).toBeInTheDocument();
        });
        await waitFor(() => {
            canvas.getByText('Spain');
        });

        await step('Submits the form without selecting an option and receives required error', async () => {
            submitButton.click();
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('modules.form.formComponent.msgError'));
                canvas.getByText(I18n.getText('modules.form.field.errRequired'));
            });
        });

        await step('Selects the first option and submits the form', async () => {
            await input.focus();
            const spainButton = canvas.getByText('Spain').closest('button');
            spainButton.click();
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith('es', field, expect.anything());
                expect(field.getValue()).toBe('es');
                expect(input).toHaveTextContent('Spain');
            });
            submitButton.click();
            await waitFor(() => {
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
                /** @todo Fix flaky test. */
                // expect(onSubmitMock).toHaveBeenLastCalledWith({ 'select-combo': 'es' });
            });
        });

        await step('enables search, performs search and verifies search results', async () => {
            field.setAttribute('has-search', 'true');
            await waitFor(() => {
                input = field.getInput();
                expect(input).toHaveAttribute('type', 'text');
            });
            
            await userEvent.type(input, 'United', { delay: 10 });
            await fireEvent.keyUp(input, { key: 'Space' });
            const searchMatches = canvas.getAllByText('United');
            expect(searchMatches).toHaveLength(2);
            expect(canvas.getByText('Spain')).not.toBeVisible();
            await fireEvent.click(searchMatches[1]);
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith('uk', field, expect.anything());
            });
        });
    }
};

export default SelectComboStory;

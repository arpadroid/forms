import { I18n } from '@arpadroid/i18n';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, fireEvent } from '@storybook/test';

const html = String.raw;

const SelectFieldStory = {
    title: 'Fields/Select',
    tags: [],
    render: (args, story) =>
        FieldStory.render(args, story, 'select-field', SelectFieldStory.renderFieldContent, SelectFieldStory.renderScript),
    renderFieldContent: () => html`
        <option value="">Please select</option>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
    `
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...FieldStory.getArgTypes('Field Props') },
    args: {
        ...FieldStory.getArgs(),
        id: 'select-field',
        label: 'Select field',
        required: true
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        value: undefined
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { field, submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock, input } = setup;
        await step('Renders the field with four select options', async () => {
            expect(canvas.getByText('Select field')).toBeInTheDocument();
            expect(canvas.getByText('Volvo')).toBeInTheDocument();
            expect(canvas.getByText('Saab')).toBeInTheDocument();
            expect(canvas.getByText('Mercedes')).toBeInTheDocument();
            expect(canvas.getByText('Audi')).toBeInTheDocument();
        });

        await step('Submits the form without selecting an option and receives required error', async () => {
            submitButton.click();
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalled();
                canvas.getByText(I18n.getText('forms.form.msgError'));
                canvas.getByText(I18n.getText('forms.field.errRequired'));
            });
        });

        await step('Selects the first option and submits the form', async () => {
            await fireEvent.change(input, { target: { value: 'volvo' } });
            canvas.getByText('Volvo').click();
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith('volvo', field, expect.anything());
            });
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'select-field': 'volvo' });
            });
        });
    }
};

export default SelectFieldStory;

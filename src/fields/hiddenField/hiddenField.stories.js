/** @typedef {import('./fieldInterface.js').FieldInterface} FieldInterface */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect, fireEvent } from '@storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {},
    args: {
        value: 'hidden value',
        id: 'hidden-field'
    }
};

const TextFieldStory = {
    title: 'Forms/Fields/Hidden',
    tags: [],
    render: (args, story) => FieldStory.render(args, story, 'hidden-field')
};

export const Test = {
    args: Default.args,
    parameters: { ...FieldTest.parameters },
    args: { ...Default.args },
    play: async ({ canvasElement, step }) => {
        const { submitButton, canvas, onSubmitMock } = await FieldTest.playSetup(canvasElement);
        await step('Submits form with field value.', async () => {
            await fireEvent.click(submitButton);    
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'hidden-field': 'hidden value' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

export default TextFieldStory;

/** @typedef {import('../field/field.types').FieldConfigType} FieldConfigType */
/** @typedef {import('@storybook/web-components-vite').Meta} Meta */
/** @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj */
/** @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext */
/** @typedef {import('@storybook/web-components-vite').Args} Args */
import { I18n } from '@arpadroid/i18n';
import { waitFor, expect } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';

/** @type {Meta} */
const TextFieldStory = {
    title: 'Forms/Fields/Text',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) => FieldStory.render(args, story, 'text-field')
};

const category = 'Text Field Props';
/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        regex: { table: { category } },
        regexMessage: { table: { category } },
        ...FieldStory.getArgTypes()
    },
    args: {
        regex: '^([a-z0-9]+)$',
        regexMessage: 'Only lowercase letters and numbers are allowed.',
        ...FieldStory.getArgs(),
        id: 'text-field',
        label: 'Text Field',
        icon: 'match_case',
        required: true
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        required: true,
        regex: Default.args.regex,
        regexMessage: Default.args.regexMessage
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { input, submitButton, canvas, onErrorMock, onSubmitMock } = setup;

        await step('Submits form with invalid regex value: "some value".', () => {
            input.value = 'some value';
            submitButton?.click();
        });

        await step('Checks for error message.', async () => {
            await waitFor(() => {
                canvas.getByText('Only lowercase letters and numbers are allowed.');
                canvas.getByText(I18n.getText('forms.form.msgError'));
                expect(onErrorMock).toHaveBeenCalled();
            });
        });

        await step('Submits form with valid field value.', async () => {
            input.value = 'valid';
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'text-field': 'valid' });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });
    }
};

/** @type {Meta} */
export default TextFieldStory;

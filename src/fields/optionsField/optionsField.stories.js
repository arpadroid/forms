/** @typedef {import('./optionsField.js').default} OptionsField */
/* eslint-disable sonarjs/no-duplicate-string */
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, fn } from '@storybook/test';

const html = String.raw;

const OptionsFieldStory = {
    title: 'Fields/Options',
    tags: [],
    render: (args, story) =>
        FieldStory.render(args, story, 'options-field', OptionsFieldStory.renderFieldContent, OptionsFieldStory.renderScript),
    renderFieldContent: () => html`
        <field-option value="option1" label="Option 1"></field-option>
        <field-option value="option2" label="Option 2"></field-option>
        <field-option value="option3" label="Option 3"></field-option>
    `,
    getArgs: () => ({
        autoFetchOptions: true,
        ...FieldStory.getArgs(),
        id: 'options-field',
        label: 'Options field',
        required: true
    }),
    getArgTypes: () => ({
        autoFetchOptions: {
            control: 'boolean',
            table: { category: 'Options Field Props' }
        },
        fetchOptions: {
            control: 'callback',
            table: { category: 'Options Field Props' }
        },
        ...FieldStory.getArgTypes('Field Props')
    })
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: { ...OptionsFieldStory.getArgTypes() },
    args: { ...OptionsFieldStory.getArgs() }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { canvas } = setup;
        /** @type {OptionsField} */
        const field = setup.field;

        step('Renders the field with three radio options', async () => {
            expect(canvas.getByText('Options field')).toBeInTheDocument();
            expect(canvas.getByText('Option 1')).toBeInTheDocument();
            expect(canvas.getByText('Option 2')).toBeInTheDocument();
            expect(canvas.getByText('Option 3')).toBeInTheDocument();
        });

        step('sets fetchOptions, fetches options and renders them', async () => {
            const fetchOptions = fn(async () => {
                return Promise.resolve([
                    { value: 'option4', label: 'Option 4', icon: 'grocery' },
                    { value: 'option5', label: 'Option 5', icon: 'nutrition' },
                    { value: 'option6', label: 'Option 6', icon: 'person' }
                ]);
            });
            field.setFetchOptions(fetchOptions);
            await waitFor(() => {
                expect(fetchOptions).toHaveBeenCalled();
                expect(canvas.getByText('Option 4')).toBeInTheDocument();
                expect(canvas.getByText('Option 5')).toBeInTheDocument();
                expect(canvas.getByText('Option 6')).toBeInTheDocument();
            });
        });
        await new Promise(resolve => setTimeout(resolve, 50));
        await step('Sets a new list of options to the field', async () => {
            field.setOptions([
                { value: 'option7', label: 'Option 7', icon: 'grocery' },
                { value: 'option8', label: 'Option 8', icon: 'nutrition' }
            ]);
            await waitFor(() => {
                expect(canvas.getByText('Option 7')).toBeInTheDocument();
                expect(canvas.getByText('Option 8')).toBeInTheDocument();
            });
        });
    }
};

export default OptionsFieldStory;

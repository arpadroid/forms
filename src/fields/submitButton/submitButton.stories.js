// import { attrString } from '@arpadroid/tools';
import { waitFor, expect, within, fireEvent } from '@storybook/test';
const category = 'Submit Button Props';
const html = String.raw;
const SubmitButtonStory = {
    title: 'Forms/Components/Submit Button',
    tags: [],
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await customElements.whenDefined('arpa-button');
        await customElements.whenDefined('text-field');
        const buttonNode = canvasElement.querySelector('button');
        const form = canvasElement.querySelector('arpa-form');
        return { canvas, buttonNode, form };
    },
    args: {
        content: 'Click me',
        icon: 'task_alt',
        submitText: 'Submit'
    },
    argTypes: {
        content: { control: { type: 'text' }, table: { category } },
        icon: { control: { type: 'text' }, table: { category } },
        iconRight: { control: { type: 'text' }, table: { category } }
    },
    render: args => {
        delete args.content;
        return html`<arpa-form id="submit-button-form">
            <text-field id="text" label="Text" required></text-field>
            <number-field id="number" label="Number" required min="0" max="20"></number-field>
        </arpa-form>`;
    }
};

export const Default = {
    name: 'Render'
};

export const Test = {
    name: 'Render',
    play: async ({ canvasElement, step, canvas }) => {
        const { form } = await SubmitButtonStory.playSetup(canvasElement);
        const textField = form.getField('text');
        const numberField = form.getField('number');
        await numberField?.promise;
        const submitButton = await waitFor(() => canvas.getByRole('button', { name: 'Submit' }));
        console.log('submitButton', submitButton);
        await step(
            'Renders the button and expects data-invalid attribute to be present in container since the fields are required',
            async () => {
                await waitFor(() => {
                    expect(submitButton).not.toBeNull();
                    expect(submitButton).toHaveAttribute('data-invalid');
                });
            }
        );

        await step('Fills the form and expects data-invalid attribute to be removed', async () => {
            await customElements.whenDefined('text-field');
            textField.setValue('text');
            await fireEvent.input(textField.input);
            numberField.setValue('32');
            await fireEvent.input(numberField.input);
            await new Promise(resolve => setTimeout(resolve, 200));
            await waitFor(() => {
                expect(submitButton).toHaveAttribute('data-invalid');
            });
            await new Promise(resolve => setTimeout(resolve, 200));
            numberField.setValue('20');
            await fireEvent.input(textField.input);
            await waitFor(() => expect(submitButton).not.toHaveAttribute('data-invalid'));
        });
    }
};

export default SubmitButtonStory;

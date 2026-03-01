// import { attrString } from '@arpadroid/tools';
/** @typedef {import('@storybook/web-components-vite').Meta} Meta */
/** @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj */
/** @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext */
/** @typedef {import('@storybook/web-components-vite').Args} Args */
/**
 * @typedef {import('../field/field').FormComponent} FormComponent
 */
import { waitFor, expect, within, fireEvent } from 'storybook/test';
const category = 'Submit Button Props';
const html = String.raw;

/**
 * Sets up test scenario for submit button story.
 * @param {HTMLElement} canvasElement - The canvas element of the story.
 * @returns {Promise<{canvas: ReturnType<typeof within>, buttonNode: HTMLButtonElement | null, form: FormComponent}>}
 */
async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await customElements.whenDefined('arpa-button');
    await customElements.whenDefined('text-field');
    const buttonNode = canvasElement.querySelector('button');
    const form = /** @type {FormComponent } */ (canvasElement.querySelector('arpa-form'));
    return { canvas, buttonNode, form };
}

/** @type {Meta} */
const SubmitButtonStory = {
    title: 'Forms/Components/Submit Button',
    tags: [],
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
    render: (/** @type {Args} */ args) => {
        delete args.content;
        return html`<arpa-form id="submit-button-form">
            <text-field id="text" label="Text" required></text-field>
            <number-field id="number" label="Number" required min="0" max="20"></number-field>
        </arpa-form>`;
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render'
};

/** @type {StoryObj} */
export const Test = {
    name: 'Render',
    play: async ({ canvasElement, step, canvas }) => {
        const { form } = await playSetup(canvasElement);
        const textField = /** @type {import('../textField/textField').default} */ (form.getField('text'));
        const numberField = form.getField('number');
        await numberField?.promise;
        const submitButton = await waitFor(() => canvas.getByRole('button', { name: 'Submit' }));
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
            if (!textField.input) throw new Error('Text field input element not found in the setup.');
            if (!numberField?.input) throw new Error('Number field input element not found in the setup.');
            textField?.setValue('text');
            await fireEvent.input(textField?.input);
            numberField?.setValue('32');
            await fireEvent.input(numberField?.input);
            await new Promise(resolve => setTimeout(resolve, 200));
            await waitFor(() => {
                expect(submitButton).toHaveAttribute('data-invalid');
            });
            await new Promise(resolve => setTimeout(resolve, 200));
            numberField?.setValue('20');
            await fireEvent.input(textField?.input);
            await waitFor(() => expect(submitButton).not.toHaveAttribute('data-invalid'));
        });
    }
};

/** @type {Meta} */
export default SubmitButtonStory;

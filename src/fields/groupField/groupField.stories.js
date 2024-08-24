/**
 * @typedef {import('./groupField.js').default} GroupField
 */
/* eslint-disable sonarjs/no-duplicate-string */
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect } from '@storybook/test';

const html = String.raw;
const category = 'Group Field Props';
const GroupFieldStory = {
    title: 'Fields/Group',
    tags: [],
    render: (args, story) =>
        FieldStory.render(args, story, 'group-field', GroupFieldStory.renderFieldContent, GroupFieldStory.renderScript),
    renderFieldContent: () => html`
        <email-field id="email" label="Email" required value="some@email.com"></email-field>
        <text-field id="text" label="Text" required value="some more text"></text-field>
        <textarea-field id="text-area" label="Text area" required value="some text"></textarea-field>
        <number-field id="number" label="Number" required value="1"></number-field>
    `,
    renderScript: (args, story) => {
        if (story.name === 'Test') {
            return '';
        }
        return html`
            <script type="module">
                customElements.whenDefined('arpa-form').then(() => {
                    const form = document.getElementById('field-form');
                    form.onSubmit(values => {
                        console.log('Form values', values);
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
        open: { control: 'boolean', table: { category } },
        isCollapsible: { control: 'boolean', table: { category } },
        rememberToggle: { control: 'boolean', table: { category } },
        ...FieldStory.getArgTypes()
    },
    args: {
        open: true,
        isCollapsible: true,
        rememberToggle: false,
        ...FieldStory.getArgs(),
        label: 'Field Group'
    }
};

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        rememberToggle: false,
        open: true
    },
    play: async ({ canvasElement, step }) => {
        const setup = await FieldTest.playSetup(canvasElement);
        const { submitButton, canvas, onSubmitMock } = await FieldTest.playSetup(canvasElement);
        /** @type {GroupField} */
        const field = setup.field;

        await step('Renders the group and the fields', () => {
            expect(canvas.getByText('Field Group')).toBeInTheDocument();
            const fields = field.getFields();
            expect(fields).toHaveLength(4);
        });

        const toggle = canvas.getByText('Field Group');
        const emailLabel = canvas.getByText('Email');
        await step('Collapses the group', async () => {
            expect(emailLabel).toBeVisible();
            toggle.click();
            await waitFor(() => {
                expect(emailLabel).not.toBeVisible();
                expect(field.isOpen()).toBe(false);
            });
        });

        await step('Expands the group', async () => {
            expect(emailLabel).not.toBeVisible();
            toggle.click();
            await waitFor(() => {
                expect(emailLabel).toBeVisible();
                expect(field.isOpen()).toBe(true);
            });
        });

        await step('Submits the form and receives expected values', async () => {
            submitButton.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({
                    email: 'some@email.com',
                    text: 'some more text',
                    'text-area': 'some text',
                    number: 1
                });
            });
        });
    }
};

export default GroupFieldStory;

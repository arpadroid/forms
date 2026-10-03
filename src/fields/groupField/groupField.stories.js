/**
 * @typedef {import('./groupField.types.js').GroupFieldConfigType} GroupFieldConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<GroupFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<GroupFieldConfigType>} Story
 * @typedef {import('./groupField.js').default} GroupField
 */
import { waitFor, expect, userEvent } from 'storybook/test';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';
import { $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';

const html = String.raw;

/** @type {Meta} */
const GroupFieldStory = {
    title: 'Forms/Fields/Group',
    component: 'group-field',
    args: {
        id: 'group-field',
        label: 'Field Group',
        icon: 'stack',
        open: true,
        isCollapsible: true,
        rememberToggle: false
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <group-field ${$attr(args)}>
                <email-field id="email" label="Email" required value="some@email.com"></email-field>
                <text-field id="text" label="Text" required value="some more text"></text-field>
                <textarea-field id="text-area" label="Text area" required value="some text"></textarea-field>
                <number-field id="number" label="Number" required value="1"></number-field>
            </group-field>
        </arpa-form>
    `
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams
};

/** @type {Story} */
export const Test = {
    parameters: testParams,
    args: {
        ...Default.args,
        rememberToggle: false,
        open: true
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'group-field',
            canvas,
            canvasElement
        });
        const { submitButton, onSubmitMock } = setup;
        const field = /** @type {GroupField} */ (setup.field);
        await step('Renders the group and the fields', () => {
            expect(canvas.getByText('Field Group')).toBeInTheDocument();
            const fields = field.getFields();
            expect(fields).toHaveLength(4);
        });

        const toggle = canvas.getByText('Field Group');
        const emailLabel = canvas.getByText('Email');
        await step('Collapses the group', async () => {
            expect(emailLabel).toBeVisible();
            await userEvent.click(toggle);
            await waitFor(() => {
                expect(emailLabel).not.toBeVisible();
                expect(field.isOpen()).toBe(false);
            });
        });

        await step('Expands the group', async () => {
            expect(emailLabel).not.toBeVisible();
            await userEvent.click(toggle);
            await waitFor(() => {
                expect(emailLabel).toBeVisible();
                expect(field.isOpen()).toBe(true);
            });
        });

        await step('Submits the form and receives expected values', async () => {
            await userEvent.click(submitButton);
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

/** @type {Meta} */
export default GroupFieldStory;

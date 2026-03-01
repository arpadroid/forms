/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./groupField.js').default} GroupField
 */
/* eslint-disable sonarjs/no-duplicate-string */
import { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, userEvent } from 'storybook/test';
import { getArgs, getArgTypes, playSetup, renderField } from '../field/field.stories.util.js';
import { renderFieldContent, renderScript } from './groupField.stories.util.js';

const category = 'Group Field Props';

/** @type {Meta} */
const GroupFieldStory = {
    title: 'Forms/Fields/Group',
    tags: [],
    render: (args, story) => renderField(args, story, 'group-field', renderFieldContent, renderScript)
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...getArgTypes(),
        open: { control: 'boolean', table: { category } },
        isCollapsible: { control: 'boolean', table: { category } },
        rememberToggle: { control: 'boolean', table: { category } }
    },
    args: {
        open: true,
        isCollapsible: true,
        rememberToggle: false,
        ...getArgs(),
        label: 'Field Group'
    }
};

/** @type {StoryObj} */
export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        rememberToggle: false,
        open: true
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const setup = await playSetup(canvasElement, {
            fieldTag: 'group-field'
        });
        const { submitButton, canvas, onSubmitMock } = setup;
        const field = /** @type {GroupField} */ (setup.field);
        if (!submitButton) throw new Error('Submit button not found');
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

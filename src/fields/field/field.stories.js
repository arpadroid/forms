/**
 * @typedef {import('./field.types').FieldConfigType} FieldConfigType
 * @typedef {import('./field').default} Field
 * @typedef {import('../../components/form/form').default} Form
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { Story, DefaultStory, TestDefault } from './stories.util.js';
import { I18n } from '@arpadroid/i18n';

import { waitFor, within, expect, fn, getByText } from 'storybook/test';
// import Field from './field.js';

const html = String.raw;

/** @type {Meta} */
const FieldStory = { ...Story };

/** @type {StoryObj} */
export const Default = { ...DefaultStory };

/** @type {StoryObj} */
export const Test = {
    ...TestDefault
};

export const Zones = {
    args: {
        id: 'zoned-field',
        content: 'Test content',
        label: undefined
    },
    render: (/** @type {Args} */ args) => {
        return html`
            <arpa-form id="field-form">
                <text-field required id="zone-field">
                    <zone name="label">Field label</zone>
                    <zone name="description">Test description</zone>
                    <zone name="footnote">This is a footnote</zone>
                    <!-- <zone name="tooltip">test tooltip</zone> -->
                    <zone name="input-rhs">
                        <icon-button icon="more_horiz">
                            <zone name="tooltip-content">More options</zone>
                        </icon-button>
                    </zone>
                    ${args.content}
                </text-field>
            </arpa-form>
        `;
    }
    /**
     * Plays the zone field.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     * @todo Investigate why test is failing in CI.
     */
    // play: async ({ canvasElement, step }) => {
    //     const canvas = within(canvasElement);
    //     await new Promise(resolve => setTimeout(resolve, 500));
    //     await step('Renders the zone content.', async () => {
    //         expect(canvas.getByText('This is a footnote')).toBeInTheDocument();
    //         expect(canvas.getByText('Test description')).toBeInTheDocument();
    //         expect(canvas.getByText('test tooltip')).toBeInTheDocument();
    //         expect(canvas.getByText('Field label')).toBeInTheDocument();
    //     });
    // }
};

export default FieldStory;

/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import Story, { DefaultStory, DefaultTest } from './stories.util.js';

/** @type {Meta} */
const FileFieldStory = { ...Story };

/** @type {StoryObj} */
export const Default = DefaultStory;

/** @type {StoryObj} */
export const Test = { ...DefaultTest };

export default FileFieldStory;

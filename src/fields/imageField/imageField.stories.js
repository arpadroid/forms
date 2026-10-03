/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('./imageField.types.js').ImageFieldConfigType} ImageFieldConfigType
 * @typedef {import('./imageField.js').default} ImageField
 * @typedef {import('@storybook/web-components-vite').Meta<ImageFieldConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<ImageFieldConfigType>} Story
 */

import { expect, fireEvent, waitFor, userEvent } from 'storybook/test';
import { I18n } from '@arpadroid/i18n';
import { TextFileSmall } from '../../test/mocks/fileMock.js';
import { createImageFileFromURL } from '../../test/mocks/imageMock.js';
import { formatBytes, $attr } from '@arpadroid/tools';
import { playSetup } from '../field/field.stories';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;
const assetsURL = '/test-assets';

/** @type {Meta} */
const ImageFieldStory = {
    title: 'Forms/Fields/Image',
    component: 'image-field',
    args: {
        id: 'image-field',
        label: 'Image field',
        required: true,
        hasDropArea: true
    },
    render: args => html`
        <arpa-form id="test-form" debounce="0">
            <image-field ${$attr(args)}>
                <image-item src="${assetsURL}/girl.jpg"></image-item>
            </image-field>
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
        id: 'image-field-test'
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'image-field',
            canvas,
            canvasElement
        });
        const { submitButton, onErrorMock, onSubmitMock, onChangeMock, form } = setup;
        const field = /** @type {ImageField} */ (setup.field);

        if (!form) throw new Error('Form element not found');

        await customElements.whenDefined('file-list');

        const i18nKey = field.i18nKey;
        const galaxyImage = await createImageFileFromURL('/test-assets/galaxy.jpg', 'galaxy.jpg');
        const input = /** @type {HTMLInputElement | null} */ (canvasElement.querySelector('input[type="file"]'));
        if (!input) throw new Error('Input element not found');

        await step('Renders the field', async () => {
            await waitFor(() => {
                expect(canvas.getByText(I18n.getText(`${i18nKey}.lblUploadedFiles`))).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeDefined();
            });
        });

        await step('Renders the default image', async () => {
            expect(canvas.getByText('girl')).toBeInTheDocument();
            expect(canvas.getByText('jpg')).toBeInTheDocument();
        });

        await step('Adds an invalid file type and displays an error', async () => {
            await fireEvent.change(input, { target: { files: [TextFileSmall] } });
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalledTimes(1);
                const errorContainer = field.querySelector('i18n-text[key="forms.fields.image.errExtensions"]');
                expect(errorContainer).toBeInTheDocument();
                expect(errorContainer?.textContent).toBe(
                    I18n.getText('forms.fields.image.errExtensions', {
                        extensions: 'jpg, png, gif, jpeg, svg',
                        file: TextFileSmall.name
                    })
                );
            });
        });

        await step('Adds a valid file type with a warning the old one will be overwritten.', async () => {
            onChangeMock.mockReset();
            await fireEvent.change(input, { target: { files: [galaxyImage] } });
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenCalledWith([galaxyImage], field, expect.anything());
                const warning = I18n.getText(`${field.i18nKey}.msgFileOverwriteWarning`);
                expect(canvas.getByText(warning)).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeInTheDocument();
                expect(canvas.getByText('galaxy')).toBeInTheDocument();
                expect(canvas.getByText(formatBytes(galaxyImage.size))).toBeInTheDocument();
            });
        });

        await step('Submits the form and checks the file is uploaded.', async () => {
            await userEvent.click(submitButton);
            await waitFor(() => {
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                const items = field.fileList?.listResource?.getItems();
                expect(items).toHaveLength(1);
                expect(onSubmitMock).toHaveBeenCalledWith({ 'image-field-test': galaxyImage });
                const warning = I18n.getText(`${field.i18nKey}.msgFileOverwriteWarning`);
                expect(canvas.queryByText(warning)).not.toBeInTheDocument();
            });
        });

        await step(
            "Checks that after submission the old file is removed and the new one now forms part of the field's uploaded files list",
            async () => {
                await waitFor(() => {
                    const testFile = canvas.queryByText(galaxyImage.name.split('.')[0]);
                    const list = testFile?.closest('image-list');
                    expect(list).toBe(field.fileList);
                });
            }
        );
    }
};

/** @type {Story} */
export const AllowMultiple = {
    parameters: testParams,
    args: {
        label: 'Allow Multiple',
        id: 'image-field-test-allow-multiple',
        allowMultiple: true
    },
    play: async ({ canvasElement, canvas, step }) => {
        const setup = await playSetup({
            tag: 'image-field',
            canvas,
            canvasElement
        });
        const { submitButton, onSubmitMock, form } = setup;
        const field = /** @type {ImageField} */ (setup.field);

        if (!form) throw new Error('Form element not found');

        await customElements.whenDefined('file-list');

        const uploadList = field.uploadList;
        const i18nKey = field.i18nKey;

        const flowerImage = await createImageFileFromURL('/test-assets/flower.jpg', 'flower.jpg');
        const planeImage = await createImageFileFromURL('/test-assets/plane.jpg', 'plane.jpg');

        const input = /** @type {HTMLInputElement | null} */ (canvasElement.querySelector('input[type="file"]'));
        if (!input) throw new Error('Input element not found');

        await step('Renders the field', async () => {
            await waitFor(() => {
                expect(canvas.getByText(I18n.getText(`${i18nKey}.lblUploadedFiles`))).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeDefined();
            });
        });

        await step('Sets allow-multiple, adds multiple images and checks the uploaded images list.', async () => {
            field.setAttribute('allow-multiple', '');
            await field.promise;
            await field.waitForArpaNodes();
            await waitFor(() => expect(field.hasProp('allowMultiple')).toBe(true));
            await fireEvent.change(input, { target: { files: [planeImage, flowerImage] } });

            await waitFor(() => {
                const items = uploadList?.listResource?.getItems();
                expect(items).toHaveLength(2);
                expect(canvas.getByText('plane')).toBeInTheDocument();
                expect(canvas.getByText('flower')).toBeInTheDocument();
                expect(canvas.getByText(formatBytes(planeImage.size))).toBeInTheDocument();
                expect(canvas.getByText(formatBytes(flowerImage.size))).toBeInTheDocument();
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'image-field-test-allow-multiple': [planeImage, flowerImage] });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                const items = field.fileList?.listResource?.getItems();
                expect(items).toHaveLength(2);
            });
        });
    }
};

export default ImageFieldStory;

/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';
import { formatBytes } from '@arpadroid/tools';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import FileFieldStory from '../fileField/fileField.stories.js';
import { waitFor, expect, fireEvent } from '@storybook/test';
import { TextFileSmall } from '../../test/mocks/fileMock.js';
import { createImageFileFromURL } from '../../test/mocks/imageMock.js';
import galaxySrc from '/assets/galaxy.jpg';
import flowerSrc from '/assets/flower.jpg';
import planeSrc from '/assets/plane.jpg';

const html = String.raw;
const assetsURL = 'http://www.local/arpadroid/forms/assets';

const ImageFieldStory = {
    title: 'Fields/Image',
    tags: [],
    render: (args, story) =>
        FieldStory.render(args, story, 'image-field', ImageFieldStory.renderFieldContent, FileFieldStory.renderScript),
    renderFieldContent: () => html`<image-item src="${assetsURL}/girl.jpg"></image-item>`
};
export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: {
        ...FileFieldStory.getArgTypes('File Props')
    },
    args: {
        ...FileFieldStory.getArgs(),
        id: 'image-field',
        label: 'Image field',
        required: true
    }
};

delete Default.args.extensions;

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: { ...Default.args, id: 'image-field-test'},
    play: async ({ canvasElement, step }) => {
        const { field, submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock, input } =
            await FieldTest.playSetup(canvasElement);

        await customElements.whenDefined('file-list');
        const uploadList = canvasElement.querySelector('.fileField__uploadList');
        const i18nKey = field.i18nKey;

        const galaxyImage = await createImageFileFromURL(galaxySrc, 'galaxy.jpg');
        const flowerImage = await createImageFileFromURL(flowerSrc, 'flower.jpg');
        const planeImage = await createImageFileFromURL(planeSrc, 'plane.jpg');

        await step('Renders the field', async () => {
            canvas.getByText('Image field');
            expect(canvas.getByText(I18n.getText(`${i18nKey}.lblUploadedFiles`))).toBeInTheDocument();
            expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeDefined();
        });

        await step('Renders the default image', async () => {
            expect(canvas.getByText('girl')).toBeInTheDocument();
            expect(canvas.getByText('.jpg')).toBeInTheDocument();
        });

        await step('Adds an invalid file type and displays an error', async () => {
            fireEvent.change(input, { target: { files: [TextFileSmall] } });
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalledTimes(1);
                expect(onChangeMock).toHaveBeenLastCalledWith([], field, expect.anything());
                const errorContainer = field.querySelector('.fieldErrors__list li');
                expect(errorContainer).toBeInTheDocument();
                expect(errorContainer.textContent).toBe(
                    I18n.getText('forms.fields.image.errExtensions', {
                        extensions: 'jpg, png, gif, jpeg, svg',
                        file: TextFileSmall.name
                    })
                );
            });
        });

        await step('Adds a valid file type with a warning the old one will be overwritten.', async () => {
            fireEvent.change(input, { target: { files: [galaxyImage] } });
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith([galaxyImage], field, expect.anything());
                const warning = I18n.getText(`${field.i18nKey}.msgFileOverwriteWarning`);
                expect(canvas.getByText(warning)).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeInTheDocument();
                expect(canvas.getByText('galaxy')).toBeInTheDocument();
                expect(canvas.getByText(formatBytes(galaxyImage.size))).toBeInTheDocument();
            });
        });

        await step('Submits the form and checks the file is uploaded.', async () => {
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'image-field-test': galaxyImage });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                const items = field.fileList.listResource.getItems();
                expect(items).toHaveLength(1);
            });
        });

        await step(
            "Checks that after submission the old file is removed and the new one now forms part of the field's uploaded files list",
            async () => {
                await waitFor(() => {
                    const testFile = canvas.queryByText(galaxyImage.name.split('.')[0]);
                    const list = testFile.closest('image-list');
                    expect(list).toBe(field.fileList);
                });
            }
        );

        await step('Sets allow-multiple, adds multiple images and checks the uploaded images list.', async () => {
            field.setAttribute('allow-multiple', '');
            await fireEvent.change(input, { target: { files: [planeImage, flowerImage] } });
            const items = uploadList.listResource.getItems();
            await waitFor(() => {
                expect(items).toHaveLength(2);
                expect(canvas.getByText('plane')).toBeInTheDocument();
                expect(canvas.getByText('flower')).toBeInTheDocument();
                expect(canvas.getByText(formatBytes(planeImage.size))).toBeInTheDocument();
                expect(canvas.getByText(formatBytes(flowerImage.size))).toBeInTheDocument();
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'image-field-test': [planeImage, flowerImage] });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                const items = field.fileList.listResource.getItems();
                expect(items).toHaveLength(3);
            });
        });
    }
};

export default ImageFieldStory;

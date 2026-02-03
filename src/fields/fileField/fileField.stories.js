/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, fireEvent, fn, userEvent, waitFor } from 'storybook/test';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { formatBytes } from '@arpadroid/tools';
import { I18n } from '@arpadroid/i18n';
import { EmptyImage } from '../../test/mocks/imageMock.js';
import { TextFileLarge, TextFileMock, TextFileMock2, TextFileMock3, TextFileSmall } from '../../test/mocks/fileMock.js';
import { action } from 'storybook/actions';

const html = String.raw;

/** @type {Meta} */
const FileFieldStory = {
    title: 'Forms/Fields/File',
    tags: [],
    render: (/** @type {Args} */ args, /** @type {any} */ story) =>
        FieldStory.render(args, story, 'file-field', FileFieldStory.renderFieldContent, FileFieldStory.renderScript),
    renderFieldContent: () => html`
        <file-item size="10000" src="http://localhost:8000/demo/assets/The Strange Case of Dr Jekyll and Mr Hyde.txt">
        </file-item>
    `,
    renderScript: (/** @type {Args} */ args, /** @type {any} */ story) => {
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
    },
    getArgTypes: (category = 'Props') => {
        return {
            extensions: {
                control: { type: 'text' },
                table: { category }
            },
            minSize: {
                control: { type: 'number' },
                table: { category }
            },
            maxSize: {
                control: { type: 'number' },
                table: { category }
            },
            hasDropArea: {
                control: { type: 'boolean' },
                table: { category }
            },
            allowMultiple: {
                control: { type: 'boolean' },
                table: { category }
            },
            ...FieldStory.getArgTypes(),
            onDelete: {
                action: 'onDelete',
                table: { category: 'Events' }
            },
            onUploadFile: {
                action: 'onUploadFile',
                table: { category: 'Events' }
            },
            onFilesAdded: {
                action: 'onFilesAdded',
                table: { category: 'Events' }
            }
        };
    },
    getArgs: () => {
        return {
            allowMultiple: false,
            hasDropArea: true,
            extensions: 'txt, docx, pdf',
            minSize: 0,
            maxSize: 0,
            ...FieldDefault.defaultArgs,
            id: 'file-field-render',
            label: 'File field',
            required: true
        };
    }
};

export const Default = {
    name: 'Render',
    parameters: { ...FieldDefault.parameters },
    argTypes: FileFieldStory.getArgTypes(),
    args: FileFieldStory.getArgs()
};

const onDelete = fn(() => {
    action('onDelete');
    return true;
});

const onDeleteUpload = fn(() => {
    action('onDeleteUpload');
    return true;
});

export const Test = {
    parameters: { ...FieldTest.parameters },
    args: {
        ...Default.args,
        id: 'file-field',
        minSize: 0.0001,
        maxSize: 0.0002
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { field, submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock, input } = await FieldTest.playSetup(
            canvasElement
        );
        
        field._config.onDelete = onDelete;
        field._config.onDeleteUpload = onDeleteUpload;
        await customElements.whenDefined('file-list');
        const uploadList = canvasElement.querySelector('.fileField__uploadList');
        const i18nKey = field.i18nKey;
        await field.promise;

        await step('Renders the field', async () => {
            await waitFor(() => {
                expect(canvas.getByText('File field')).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText(`${i18nKey}.lblUploadedFiles`))).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeInTheDocument();
            });
        });

        await step('Renders the default file', async () => {
            await waitFor(() => {
                expect(canvas.getByText('The Strange Case of Dr Jekyll and Mr Hyde')).toBeVisible();
                expect(canvas.getByText('.txt')).toBeVisible();
                expect(canvas.getByText('10 KB')).toBeVisible();
            });
        });

        await step('Submits the form without a file and expects an error', async () => {
            submitButton?.click();
            await waitFor(() => {
                const errorContainer = field.querySelector('.fieldErrors__list li');
                expect(errorContainer).toHaveTextContent(I18n.getText('forms.field.errRequired'));
                expect(onErrorMock).toHaveBeenCalledTimes(1);
            });
        });

        await step('Adds an invalid file type and displays an error', async () => {
            await fireEvent.change(field.input, { target: { files: [EmptyImage] } });
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith([], field, expect.anything());
                const errorContainer = field.querySelector('.fieldErrors__list');
                expect(errorContainer).toBeInTheDocument();
                const errorNode = errorContainer.querySelector('i18n-text[key="forms.fields.file.errExtensions"]');
                expect(errorNode).toHaveTextContent(
                    I18n.getText('forms.fields.file.errExtensions', {
                        extensions: 'txt, docx, pdf',
                        file: 'test.jpg'
                    })
                );
            });
        });

        await step('Adds a file too small not satisfying the minSize validation and displays error.', async () => {
            await fireEvent.change(input, { target: { files: [TextFileSmall] } });
            await waitFor(() => {
                // expect(onErrorMock).toHaveBeenCalledTimes(2);
                expect(onChangeMock).toHaveBeenLastCalledWith([], field, expect.anything());
                const errorContainer = field.querySelector('i18n-text[key="forms.fields.file.errMinSize"]');
                expect(errorContainer).toBeInTheDocument();
                const errorText = I18n.getText('forms.fields.file.errMinSize', {
                    // @ts-expect-error
                    minSize: formatBytes('0.0001'),
                    size: formatBytes(TextFileSmall.size),
                    file: TextFileSmall.name
                });
                expect(errorContainer).toHaveTextContent(errorText);
            });
        });

        await step('Adds file too big not satisfying the max validation and displays error.', async () => {
            await fireEvent.change(input, { target: { files: [TextFileLarge] } });
            await waitFor(() => {
                const errorContainer = field.querySelector('i18n-text[key="forms.fields.file.errMaxSize"]');
                expect(errorContainer).toBeInTheDocument();
                expect(onChangeMock).toHaveBeenLastCalledWith([], field, expect.anything());
                const errorText = I18n.getText('forms.fields.file.errMaxSize', {
                    // @ts-expect-error
                    maxSize: formatBytes('0.0002'),
                    size: formatBytes(TextFileLarge.size),
                    file: 'large text file.txt'
                });
                expect(errorContainer).toHaveTextContent(errorText);
            });
        });

        await step('Adds a valid file type with a warning the old one will be overwritten.', async () => {
            await fireEvent.change(input, { target: { files: [TextFileMock] } });
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith([TextFileMock], field, expect.anything());
                const warning = I18n.getText(`${field.i18nKey}.msgFileOverwriteWarning`);
                expect(canvas.getByText(warning)).toBeInTheDocument();
                expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeInTheDocument();
                expect(canvas.getByText('109 bytes')).toBeInTheDocument();
            });
            expect(canvas.getByText('test file')).toBeInTheDocument();
        });

        await step('Deletes the upload and checks the onDelete signal and callback is called.', async () => {
            const deleteButton = canvasElement.querySelector('.fileField__uploadList .button--delete');
            await userEvent.click(deleteButton);
            await waitFor(() => {
                expect(onDeleteUpload).toHaveBeenLastCalledWith(deleteButton.closest('file-item'));
                expect(canvas.queryByText('test file')).toBeNull();
                expect(uploadList.listResource.getItems()).toHaveLength(0);
            });
        });

        await step('Adds a valid file and submits the form receiving expected value', async () => {
            await fireEvent.change(input, { target: { files: [TextFileMock] } });
            expect(uploadList.listResource.getItems()).toHaveLength(1);
            submitButton?.click();
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'file-field': TextFileMock });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
            });
        });

        await step(
            "Checks that after submission the old file is removed and the new one now forms part of the field's uploaded files list",
            async () => {
                await waitFor(() => {
                    const testFile = canvas.queryByText('test file');
                    const list = testFile.closest('file-list');
                    expect(list).toBe(field.fileList);
                    const items = uploadList.listResource.getItems();
                    expect(items).toHaveLength(0);
                });
            }
        );

        await step('Sets allow-multiple, adds multiple files and checks the uploaded files list.', async () => {
            field.setAttribute('allow-multiple', '');
            input.files = [TextFileMock2, TextFileMock3];
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
            await waitFor(() => {
                expect(canvas.queryByText('another text file')).not.toBeNull();
                expect(uploadList.listResource.getItems()).toHaveLength(2);
                expect(canvas.getByText('another text file')).toBeInTheDocument();
                expect(canvas.getByText('yet another text file')).toBeInTheDocument();
                expect(canvas.getByText('128 bytes')).toBeInTheDocument();
            });
            submitButton?.click();
            await new Promise(resolve => setTimeout(resolve, 100));
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenCalledWith({ 'file-field': [TextFileMock2, TextFileMock3] });
                canvas.getByText(I18n.getText('forms.form.msgSuccess'));
                const items = field.fileList.listResource.getItems();
                expect(items).toHaveLength(3);
            });
        });

        await step('Deletes the upload and checks the onDelete signal and callback is called.', async () => {
            const deleteButtons = canvas.getAllByRole('button', { name: I18n.getText('forms.fields.file.lblRemoveFile') });
            deleteButtons[0].click();
            await waitFor(() => {
                expect(onDelete).toHaveBeenCalledWith(deleteButtons[0].closest('file-item'));
                expect(canvas.queryByText('test file')).toBeNull();
                expect(uploadList.listResource.getItems()).toHaveLength(0);
                expect(field.fileList.listResource.getItems()).toHaveLength(2);
                expect(field.fileList.itemsNode.children).toHaveLength(2);
            });
        });
    }
};

export default FileFieldStory;

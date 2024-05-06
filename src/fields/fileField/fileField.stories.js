/* eslint-disable sonarjs/no-duplicate-string */
import { I18n } from '@arpadroid/i18n';
import { formatBytes } from '@arpadroid/tools';
import FieldStory, { Default as FieldDefault, Test as FieldTest } from '../field/field.stories.js';
import { waitFor, expect, fireEvent, fn, userEvent } from '@storybook/test';
import { action } from '@storybook/addon-actions';
import { EmptyImage } from '../../test/mocks/imageMock.js';
import { TextFileLarge, TextFileMock, TextFileMock2, TextFileMock3, TextFileSmall } from '../../test/mocks/fileMock.js';

const html = String.raw;

const FileFieldStory = {
    title: 'Fields/File',
    tags: [],
    render: (args, story) =>
        FieldStory.render(args, story, 'file-field', FileFieldStory.renderFieldContent, FileFieldStory.renderScript),
    renderFieldContent: () => html`
        <file-item size="10000" src="http://localhost:8000/demo/assets/The Strange Case of Dr Jekyll and Mr Hyde.txt">
        </file-item>
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

                    const field = form.getField('${args.id}');
                    field.listen('onFilesAdded', (files, field) => {
                        console.log('onFilesAdded', { files, field });
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
            ...FieldDefault.argTypes,
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
            id: 'file-field',
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
        minSize: 0.0001,
        maxSize: 0.0002
    },
    play: async ({ canvasElement, step }) => {
        const { field, submitButton, canvas, onErrorMock, onSubmitMock, onChangeMock, input } =
            await FieldTest.playSetup(canvasElement);

        field._config.onDelete = onDelete;
        field._config.onDeleteUpload = onDeleteUpload;
        await customElements.whenDefined('file-list');
        const uploadList = canvasElement.querySelector('.fileField__uploadList');
        const i18nKey = field.i18nKey;

        await step('Renders the field', async () => {
            canvas.getByText('File field');
            expect(canvas.getByText(I18n.getText(`${i18nKey}.lblUploadedFiles`))).toBeVisible();
            expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeDefined();
        });

        await step('Renders the default file', async () => {
            expect(canvas.getByText('The Strange Case of Dr Jekyll and Mr Hyde')).toBeVisible();
            expect(canvas.getByText('.txt')).toBeVisible();
            expect(canvas.getByText('10 KB')).toBeVisible();
        });

        await step('Adds an invalid file type and displays an error', async () => {
            fireEvent.change(input, { target: { files: [EmptyImage] } });
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalledTimes(1);
                expect(onChangeMock).toHaveBeenLastCalledWith([], field);
                const errorContainer = field.querySelector('.fieldErrors__list li');
                expect(errorContainer).toBeVisible();
                expect(errorContainer.textContent).toBe(
                    I18n.getText('modules.form.fields.file.errExtensions', {
                        extensions: 'txt, docx, pdf',
                        file: 'test.jpg'
                    })
                );
            });
        });

        await step('Adds a file too small not satisfying the minSize validation and displays error.', async () => {
            fireEvent.change(input, { target: { files: [TextFileSmall] } });
            await waitFor(() => {
                expect(onErrorMock).toHaveBeenCalledTimes(2);
                expect(onChangeMock).toHaveBeenLastCalledWith([], field);
                const errorContainer = field.querySelector('.fieldErrors__list li');
                expect(errorContainer).toBeVisible();
                const errorText = I18n.getText('modules.form.fields.file.errMinSize', {
                    minSize: formatBytes('0.0001'),
                    size: formatBytes(TextFileSmall.size),
                    file: TextFileSmall.name
                });
                expect(errorContainer).toHaveTextContent(errorText);
            });
        });

        await step('Adds file too big not satisfying the max validation and displays error.', async () => {
            fireEvent.change(input, { target: { files: [TextFileLarge] } });
            await waitFor(() => {
                const errorContainer = field.querySelector('.fieldErrors__list li');
                expect(errorContainer).toBeVisible();
                expect(onChangeMock).toHaveBeenLastCalledWith([], field);
                const errorText = I18n.getText('modules.form.fields.file.errMaxSize', {
                    maxSize: formatBytes('0.0002'),
                    size: formatBytes(TextFileLarge.size),
                    file: 'large text file.txt'
                });
                expect(errorContainer).toHaveTextContent(errorText);
            });
        });

        await step('Adds a valid file type with a warning the old one will be overwritten.', async () => {
            fireEvent.change(input, { target: { files: [TextFileMock] } });
            await waitFor(() => {
                expect(onChangeMock).toHaveBeenLastCalledWith([TextFileMock], field);
                const warning = I18n.getText(`${field.i18nKey}.msgFileOverwriteWarning`);
                expect(canvas.getByText(warning)).toBeVisible();
                expect(canvas.getByText(I18n.getText('common.labels.lblUploads'))).toBeVisible();
                expect(canvas.getByText('test file')).toBeVisible();
                expect(canvas.getByText('109 bytes')).toBeVisible();
            });
        });

        await step('Deletes the upload and checks the onDelete signal and callback is called.', async () => {
            const deleteButton = canvas.getByRole('button', { name: 'Remove upload' });
            userEvent.click(deleteButton);
            await waitFor(() => {
                expect(onDeleteUpload).toHaveBeenLastCalledWith(deleteButton.closest('file-item'));
                expect(canvas.queryByText('test file')).toBeNull();
                expect(uploadList.listResource.getItems()).toHaveLength(0);
            });
        });

        await step('Adds a valid file and submits the form receiving expected value', async () => {
            await fireEvent.change(input, { target: { files: [TextFileMock] } });
            expect(uploadList.listResource.getItems()).toHaveLength(1);
            userEvent.click(submitButton);
            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'file-field': TextFileMock });
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
            });
        });

        await step(
            "Checks that after submission the old file is removed and the new one now forms part of the field's uploaded files list",
            async () => {
                const testFile = canvas.queryByText('test file');
                const list = testFile.closest('file-list');
                expect(list).toBe(field.fileList);
            }
        );

        await step('Sets allow-multiple, adds multiple files and checks the uploaded files list.', async () => {
            field.setAttribute('allow-multiple', '');
            fireEvent.change(input, { target: { files: [TextFileMock2, TextFileMock3] } });
            await waitFor(() => {
                expect(canvas.queryByText('another text file')).not.toBeNull();
                expect(uploadList.listResource.getItems()).toHaveLength(2);
                expect(canvas.getByText('another text file')).toBeVisible();
                expect(canvas.getByText('yet another text file')).toBeVisible();
                expect(canvas.getByText('128 bytes')).toBeVisible();
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(onSubmitMock).toHaveBeenLastCalledWith({ 'file-field': [TextFileMock2, TextFileMock3] });
                canvas.getByText(I18n.getText('modules.form.formComponent.msgSuccess'));
                const items = field.fileList.listResource.getItems();
                expect(items).toHaveLength(3);
            });
        });

        await step('Deletes the upload and checks the onDelete signal and callback is called.', async () => {
            const deleteButtons = canvas.getAllByRole('button', { name: I18n.getText('modules.form.fields.file.lblRemoveFile') });
            userEvent.click(deleteButtons[0]);
            await waitFor(() => {
                expect(onDelete).toHaveBeenLastCalledWith(deleteButtons[0].closest('file-item'));
                expect(canvas.queryByText('test file')).toBeNull();
                expect(uploadList.listResource.getItems()).toHaveLength(0);
                expect(field.fileList.listResource.getItems()).toHaveLength(2);
                expect(field.fileList.itemsNode.children).toHaveLength(2);
            });
        });
    }
};

export default FileFieldStory;

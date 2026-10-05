/**
 * @typedef {import('./fileField.types').FileFieldConfigType} FileFieldConfigType
 * @typedef {import('./components/fileItem/fileItem.types').FileItemConfigType} FileItemConfigType
 * @typedef {import('./components/fileItem/fileItem.js').default} FileItem
 * @typedef {import('./components/fileList/fileList.js').default} FileList
 * @typedef {import("@arpadroid/ui").DropArea} DropArea
 */

import { I18n } from '@arpadroid/i18n';
import Field from '../field/field.js';
import { defineCustomElement, mergeObjects, renderNode } from '@arpadroid/tools';

const html = String.raw;
class FileField extends Field {
    /////////////////////////
    // #region Setup
    /////////////////////////

    /** @type {FileFieldConfigType} */
    _config = this._config;
    /** @type {File[]} */
    uploads = [];

    /**
     * Returns default config.
     * @returns {FileFieldConfigType}
     */
    getDefaultConfig() {
        /** @type {FileFieldConfigType} */
        const conf = {
            allowMultiple: false,
            classNames: ['fileField'],
            extensions: [],
            fileComponent: 'file-item',
            fileListIcon: 'gallery_thumbnail',
            fileListLabel: this.i18nText('lblUploadedFiles'),
            hasDropArea: false,
            hasInputMask: false,
            inputComponent: 'file-field-input',
            inputType: 'file',
            lblAddFile: this.i18n('lblAddFile'),
            lblRemoveFile: '{i18n:lblRemoveFile}',
            lblUploads: '{i18n:lblUploads}',
            listComponent: 'file-list',
            uploadListComponent: 'file-list',
            uploadListIcon: 'upload'
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }
    // #endregion

    //////////////////////
    // #region ACCESSORS
    /////////////////////

    /**
     * Adds a file to the uploads array.
     * @param {File} file - The file to add.
     * @returns {boolean} True if the file was added, false otherwise.
     */
    addUpload(file) {
        const isValid = this?.validator?.validateFile(file);
        if (isValid) {
            this.uploads.push(file);
            this.uploadList?.addItem({
                file,
                lblRemoveFile: this.i18nText('lblRemoveFile'),
                onDelete: this._config.onDeleteUpload,
                key: file.name + file.size
            });
        }
        return Boolean(isValid);
    }

    /**
     * Adds multiple uploads to the upload list.
     * @param {File[]} files - The files to upload.
     */
    addUploads(files) {
        /** @type {FileItemConfigType[]} */
        const items = files.map(file => ({ file }));
        this.uploadList?.addItems(items);
    }

    clearUploads() {
        this.uploadList?.removeItems();
    }

    getFieldType() {
        return 'file';
    }

    /**
     * Returns the file nodes.
     * @returns {FileItem[] | undefined}
     */
    getFileNodes() {
        const { fileComponent } = this._config;
        return /** @type {FileItem[]} */ (
            this._childNodes?.filter(node => node instanceof HTMLElement && node?.tagName?.toLowerCase() === fileComponent) || []
        );
    }

    hasDropArea() {
        const hasAttr = this.hasAttribute('has-drop-area');
        return (hasAttr && this.getAttribute('has-drop-area') !== 'false') || (!hasAttr && this._config.hasDropArea);
    }

    hasUploadWarning() {
        return Boolean(Number(this.uploads?.length) > 0 && Number(this.fileList?.itemsNode?.children.length) > 0);
    }

    getI18nKey() {
        return 'forms.fields.file';
    }

    getUploadListLabel() {
        return I18n.getText('common.labels.lblUploads');
    }

    /**
     * Sets the value of the field.
     * @param {File[]} value
     * @returns {this}
     */
    setValue(value) {
        this.addUploads(value);
        return this;
    }

    resetValue() {
        this.clearUploads();
    }

    /**
     * Sets the extensions allowed for the file field.
     * @param {string[]} extensions - The allowed extensions.
     * @returns {this}
     */
    setExtensions(extensions = []) {
        this.setAttribute('extensions', extensions.join(','));
        return this;
    }

    getExtensions() {
        const attrVal = this.getAttribute('extensions');
        if (attrVal) {
            return attrVal.split(',').map(ext => ext.trim());
        }
        return this._config.extensions;
    }

    /**
     * Sets the maximum size allowed for the file field.
     * @param {number} maxSize - The maximum size allowed in megabytes.
     * @returns {this}
     */
    setMaxSize(maxSize) {
        this.setAttribute('max-size', maxSize?.toString());
        return this;
    }

    getMaxSize() {
        return parseFloat(this.getProp('max-size'));
    }

    /**
     * Sets the minimum size allowed for the file field.
     * @param {number} minSize - The minimum size allowed in megabytes.
     * @returns {this}
     */
    setMinSize(minSize) {
        this.setAttribute('min-size', minSize?.toString());
        return this;
    }

    getMinSize() {
        return parseFloat(this.getProp('min-size'));
    }

    getValue() {
        return this?.getUploads();
    }

    getUploads() {
        return this.uploads;
    }

    getOutputValue() {
        const value = super.getOutputValue();
        if (!this.hasProp('allowMultiple') && Array.isArray(value)) {
            return value[0];
        }
        return value;
    }

    // #endregion

    //////////////////
    // #region RENDER
    /////////////////

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-zone name="inputWrapper">
                <div class="fileField__fileLists">
                    <arpa-node
                        name="fileList"
                        tag="{listComponent}"
                        id="{id}-fileList"
                        class="fileField__fileList"
                        title-icon="{fileListIcon}"
                        title="{fileListLabel}"
                    >
                        <template template-type="list-item" lbl-remove-file="${this.getProp('lblRemoveFile')}"></template>
                    </arpa-node>
                    <arpa-node
                        tag="${this.getProp('uploadListComponent')}"
                        class="fileField__uploadList"
                        titleIcon="{uploadListIcon}"
                        name="uploadList"
                        id="{id}-uploadList"
                        title-icon="{uploadListIcon}"
                        can-render="hasUploads()"
                        title="{i18n:lblUploads}"
                    ></arpa-node>
                </div>
                <arpa-node
                    $on-drop="{onInputChange}"
                    name="dropArea"
                    tag="drop-area"
                    input-id="{id}"
                    can-render="hasDropArea()"
                ></arpa-node>
                <arpa-node
                    name="selectButton"
                    tag="arpa-button"
                    icon="upload_file"
                    class="fileField__selectButton"
                    can-render="!hasDropArea()"
                    on-click="{onFileSelectClick}"
                >
                    {lblAddFile}
                </arpa-node>
            </arpa-zone>
        `;
    }

    renderFileSelect(inputId = this.getHtmlId()) {
        return this.hasDropArea() ? html`<drop-area input-id="${inputId}"></drop-area>` : html``;
    }

    hasUploads() {
        return true;
    }

    // #endregion

    ////////////////////
    // #region LIFECYCLE
    ////////////////////

    async $initializeNodes() {
        await super.$initializeNodes();
        await this.waitForArpaNodes();
        this.classList.add(!this.getProp('allowMultiple') ? 'fileField--single' : 'fileField--multiple');
        this.uploadList = /** @type {FileList | undefined} */ (this.nodes.uploadList);
        this.dropArea = /** @type {DropArea | undefined} */ (this.nodes.dropArea);

        this.initializeInput();
        this.initializeFileList();

        this.handleUploadWarning();
        return true;
    }

    async initializeInput() {
        this.input = /** @type {HTMLInputElement | undefined} */ (this.getInput());
        if (!this.input) return;
        this.input.style.display = 'none';
        if (this.hasProp('allowMultiple')) {
            this.input.setAttribute('multiple', '');
        }
    }

    async initializeFileList() {
        this.fileList = /** @type {FileList | null} */ (this.nodes.fileList);
        await this.fileList?.promise;
        const files = this.getFileNodes();
        files?.length && this.fileList?.addItemNodes(files);
    }

    async handleUploadWarning() {
        await this.promise;
        const markedForDeletion = Array.from(this.fileList?.querySelectorAll('.fileItem--markedForDeletion') || []);
        markedForDeletion.forEach(node => node.classList.remove('fileItem--markedForDeletion'));
        if (this.hasUploadWarning()) {
            this.uploadWarning = this.uploadWarning ?? renderNode(this.renderUploadWarning());
            this.headerNode?.after(this.uploadWarning);
            const fileNode = this.fileList?.querySelector('.fileItem');
            if (fileNode) {
                fileNode.classList.add('fileItem--markedForDeletion');
            }
        } else {
            this.uploadWarning?.remove();
        }
    }

    renderUploadWarning() {
        return html`<warning-message class="fileField__overwriteWarning" can-close>
            ${this.i18n('msgFileOverwriteWarning')}
        </warning-message>`;
    }

    // #endregion

    //////////////////
    // #region EVENTS
    /////////////////

    /**
     * Handles the change event for the input element.
     * @param {Event} event - The event object.
     * @param {File[] | FileList | null} _files - The files to process.
     */
    onInputChange(event, _files = this.input?.files ? Array.from(this.input.files) : null) {
        const files = _files || [];
        if (!Array.isArray(files) || !files.length) {
            return;
        }
        const multiple = this.hasProp('allowMultiple');
        /** @type {File[]} */
        const invalidUploads = [];
        if (!multiple && !invalidUploads.length) {
            this.uploads = [];
            this?.clearUploads();
        }
        const uploads = files.filter(file => {
            const isValid = this.addUpload(file);
            if (!isValid) {
                invalidUploads.push(file);
            }
            return isValid;
        });
        if (uploads.length) {
            this.signal('filesAdded', uploads, this);
        }
        if (invalidUploads.length) {
            this.signal('error', invalidUploads, this);
        } else {
            this._callOnChange(event);
        }

        this.updateErrors();
    }

    /**
     * Event handler for when the value of the input changes.
     * @param {Event} event
     */
    onChange(event) {
        this.validator && (this.validator._errors = []);
        this.onInputChange(event);
        this.handleUploadWarning();
    }

    onSubmitSuccess() {
        this.reconcileListItems();
        requestAnimationFrame(() => {
            this.uploads = [];
            this.handleUploadWarning();
        });
    }

    reconcileListItems() {
        const uploadItems = this.uploadList?.getItems().map(item => {
            delete item.icon;
            delete item.lblRemoveFile;
            return item;
        });
        requestAnimationFrame(() => {
            this.clearUploads();
        });
        if (this.hasProp('allowMultiple')) {
            uploadItems?.length && this.fileList?.listResource?.addItems(uploadItems);
        } else {
            uploadItems?.length && this.fileList?.listResource?.setItems(uploadItems);
        }
    }

    onFileSelectClick() {
        this.input?.click();
    }

    // #endregion
}

defineCustomElement('file-field', FileField);

export default FileField;

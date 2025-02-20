/**
 * @typedef {import('./fileField.types').FileFieldConfigType} FileFieldConfigType
 * @typedef {import('./components/fileItem/fileItem.types').FileItemConfigType} FileItemConfigType
 * @typedef {import('./components/fileItem/fileItem.js').default} FileItem
 * @typedef {import('./components/fileList/fileList.js').default} FileList
 * @typedef {import('./components/fileFieldInput/fileFieldInput.js').default} FileFieldInput
 */

import { I18n } from '@arpadroid/i18n';
import Field from '../field/field.js';
import { defineCustomElement, mergeObjects, renderNode } from '@arpadroid/tools';

const html = String.raw;
class FileField extends Field {
    /** @type {FileFieldInput | null} */ // @ts-ignore
    input = this.input;
    /** @type {FileFieldConfigType} */ // @ts-ignore
    _config = this._config;
    /////////////////////////
    // #region INITIALIZATION
    /////////////////////////

    /**
     * Creates an instance of FileField.
     * @param {FileFieldConfigType} config
     */
    constructor(config) {
        super(config);
        this._onFileSelectClick = this._onFileSelectClick.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    /**
     * Returns default config.
     * @returns {FileFieldConfigType}
     */
    getDefaultConfig() {
        /** @type {FileFieldConfigType} */
        const conf = {
            className: 'fileField',
            inputTemplate: html`
                <input is="file-field-input" />
                <div class="fileField__fileLists">{fileList} {uploadList}</div>
                {fileSelect}
            `,
            listComponent: 'file-list',
            uploadListComponent: 'file-list',
            fileComponent: 'file-item',
            lblUploads: this.i18n('lblUploads', {}, {}, 'common.labels'),
            fileListLabel: this.i18n('lblUploadedFiles'),
            lblAddFile: this.i18n('lblAddFile'),
            hasDropArea: false,
            hasInputMask: false,
            allowMultiple: false,
            extensions: [],
            inputAttributes: {
                type: 'file'
            }
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }
    // #endregion

    //////////////////////
    // #region ACCESSORS
    /////////////////////

    /**
     * Adds an upload to the upload list.
     * @param {File} file - The file to upload.
     * @returns {FileItem | undefined}
     */
    addUpload(file) {
        return this.uploadList?.addItem({
            file,
            lblRemoveFile: this.i18nText('lblRemoveUpload'),
            onDelete: this._config.onDeleteUpload,
            key: file.name + file.size
        });
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
        this.input && (this.input.uploads = []);
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
        return Boolean(
            !this.allowMultiple() &&
                Number(this.input?.uploads?.length) > 0 &&
                Number(this.fileList?.itemsNode?.children.length) > 0
        );
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

    allowMultiple() {
        const hasAttr = this.hasAttribute('allow-multiple');
        const attr = this.getAttribute('allow-multiple');
        return (hasAttr && attr !== 'false') || (!hasAttr && this._config.allowMultiple);
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
        return parseFloat(this.getProperty('max-size'));
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
        return parseFloat(this.getProperty('min-size'));
    }

    getValue() {
        return this.input?.getUploads();
    }

    getOutputValue() {
        const value = this.getValue();
        if (!this.allowMultiple() && Array.isArray(value)) {
            return value[0];
        }
        return value;
    }

    /**
     * Returns input component.
     * @returns {FileFieldInput | null}
     */
    getInput() {
        return this.querySelector('input[type="file"]');
    }

    // #endregion

    //////////////////
    // #region RENDER
    /////////////////

    getInputTemplateVars() {
        return {
            ...super.getInputTemplateVars(),
            fileList: this.renderFileList(),
            uploadList: this.renderUploadList(),
            fileSelect: this.renderFileSelect()
        };
    }

    renderFileSelect(inputId = this.getHtmlId()) {
        return this.hasDropArea()
            ? html`<drop-area input-id="${inputId}"></drop-area>`
            : html`<button is="arpa-button" icon="upload_file" class="fileField__selectButton">
                  ${this.getProperty('lbl-add-file')}
              </button>`;
    }

    renderUploadList(id = this.getHtmlId()) {
        const { uploadListComponent: list } = this._config;
        return html`
            <${list} id="${id}-uploadList" class="fileField__uploadList"> 
                <zone name="title">${this.getProperty('lbl-uploads')}</zone>
            </${list}>
        `;
    }

    renderFileList(id = this.getHtmlId()) {
        const { listComponent: list } = this._config;
        return html`
            <${list} id="${id}-fileList" class="fileField__fileList">
                <zone name="title">${this.getProperty('file-list-label')}</zone>
            </${list}>
        `;
    }

    // #endregion

    ////////////////////
    // #region LIFECYCLE
    ////////////////////

    async _onInitialized() {
        super._onInitialized();
        await this.onReady();
        this.classList.add(!this.allowMultiple() ? 'fileField--single' : 'fileField--multiple');
        this._initializeFileList();
        /** @type {FileList | null} */
        this.uploadList = this.querySelector('.fileField__uploadList');
        /** @type {FileList | null} */
        this.fileList = this.querySelector('.fileField__fileList');
        this.dropArea = this.querySelector('drop-area');
        /** @type {FileFieldInput} */
        this.input = this.getInput();
        this.input?.removeEventListener('change', this._onChange);
        this.input?.addEventListener('change', this._onChange);
        this.fileSelectBtn = this.querySelector('.fileField__selectButton');
        this.fileSelectBtn?.addEventListener('click', this._onFileSelectClick);
        this.handleUploadWarning();
    }

    _initializeFileList() {
        /** @type {FileList | null} */
        this.fileList = this.querySelector('.fileField__fileList');
        this.fileList?.onRenderReady(() => {
            const files = this.getFileNodes();
            files?.length && this.fileList?.addItemNodes(files);
        });
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
        return html`
            <warning-message
                i18n="${this.i18nKey}.msgFileOverwriteWarning"
                class="fileField__overwriteWarning"
                can-close
            ></warning-message>
        `;
    }

    // #endregion

    //////////////////
    // #region EVENTS
    /////////////////

    /**
     * Event handler for when the value of the input changes.
     * @param {Event} event
     */
    _onChange(event) {
        this.validator && (this.validator._errors = []);
        this._callOnChange(event);
        this.handleUploadWarning();
    }

    onSubmitSuccess() {
        this.reconcileListItems();
        requestAnimationFrame(() => {
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
        if (this.allowMultiple()) {
            uploadItems?.length && this.fileList?.listResource?.addItems(uploadItems);
        } else {
            uploadItems?.length && this.fileList?.listResource?.setItems(uploadItems);
        }
    }

    _onFileSelectClick() {
        this.input?.click();
    }

    // #endregion
}

defineCustomElement('file-field', FileField);

export default FileField;

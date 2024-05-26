/**
 * @typedef {import('./fileFieldInterface').FileFieldInterface} FileFieldInterface
 * @typedef {import('./components/fileItem/fileItemInterface.js').FileItemInterface} FileItemInterface
 */

import { I18n } from '@arpadroid/i18n';
import Field from '../field/field.js';
import { mergeObjects, renderNode } from '@arpadroid/tools';

const html = String.raw;
class FileField extends Field {
    /////////////////////////
    // #region INITIALIZATION
    /////////////////////////

    constructor(config) {
        super(config);
        this._onFileSelectClick = this._onFileSelectClick.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    /**
     * Returns default config.
     * @returns {FileFieldInterface}
     */
    getDefaultConfig() {
        this.i18nKey = this.getI18nKey();
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fileField',
            inputTemplate: html`
                <input is="file-field-input" />
                <div class="fileField__fileLists">{fileList} {uploadList}</div>
                {fileSelect}
            `,
            listComponent: 'file-list',
            uploadListComponent: 'file-list',
            fileComponent: 'file-item',
            uploadListLabel: this.getUploadListLabel(),
            fileListLabel: `i18n{${this.i18nKey}.lblUploadedFiles}`,
            hasDropArea: false,
            hasInputMask: false,
            allowMultiple: false,
            extensions: [],
            inputAttributes: {
                type: 'file'
            }
        });
    }
    // #endregion

    //////////////////////
    // #region ACCESSORS
    /////////////////////

    addUpload(file) {
        return this.uploadList?.addItem({
            file,
            icon: 'upload',
            lblRemoveFile: this.i18n.lblRemoveUpload,
            onDelete: this._config.onDeleteUpload
        });
    }

    addUploads(files) {
        this.uploadList?.addItems(files.map(file => ({ file })));
    }

    clearUploads() {
        this.uploadList.removeItems();
        this.input.uploads = [];
    }

    getFieldType() {
        return 'file';
    }

    getFileNodes() {
        const { fileComponent } = this._config;
        return this._childNodes.filter(node => node?.tagName?.toLowerCase() === fileComponent);
    }

    hasDropArea() {
        const hasAttr = this.hasAttribute('has-drop-area');
        return (hasAttr && this.getAttribute('has-drop-area') !== 'false') || (!hasAttr && this._config.hasDropArea);
    }

    hasUploadWarning() {
        return !this.allowMultiple() && this.input?.uploads.length > 0 && this.fileList?.itemsNode?.children.length > 0;
    }

    getI18nKey() {
        return 'modules.form.fields.file';
    }

    getUploadListLabel() {
        return I18n.getText('common.labels.lblUploads');
    }

    /**
     * Sets the value of the field.
     * @param {FileItemInterface[]} value
     * @returns {FileField}
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

    setMaxSize(maxSize) {
        this.setAttribute('max-size', maxSize);
        return this;
    }

    getMaxSize() {
        return parseFloat(this.getProperty('max-size'));
    }

    setMinSize(minSize) {
        this.setAttribute('min-size', minSize);
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
     * @returns {*}
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
            : html`
                  <button is="arpa-button" icon="upload_file" class="fileField__selectButton">${this.i18n.lblAddFile}</button>
              `;
    }

    renderUploadList(id = this.getHtmlId()) {
        const { uploadListComponent: list } = this._config;
        const label = this.getProperty('upload-list-label');
        return html`
            <${list} id="${id}-uploadList" class="fileField__uploadList" heading="${label}"></${list}>
        `;
    }

    renderFileList(id = this.getHtmlId()) {
        const { fileListLabel: heading = '', listComponent: list } = this._config;
        return html`
            <${list} id="${id}-fileList" class="fileField__fileList" heading="${heading}"></${list}>
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
        this.uploadList = this.querySelector('.fileField__uploadList');
        this.fileList = this.querySelector('.fileField__fileList');
        this.dropArea = this.querySelector('drop-area');
        this.input = this.getInput();
        this.input.removeEventListener('change', this._onChange);
        this.input.addEventListener('change', this._onChange);
        this.fileSelectBtn = this.querySelector('.fileField__selectButton');
        this.fileSelectBtn?.addEventListener('click', this._onFileSelectClick);
        this.handleUploadWarning();
    }

    _initializeFileList() {
        this.fileList = this.querySelector('.fileField__fileList');
        if (this.fileList) {
            const files = this.getFileNodes();
            this.fileList.addItemNodes(files);
        }
    }

    handleUploadWarning() {
        const markedForDeletion = Array.from(this.fileList.querySelectorAll('.fileItem--markedForDeletion'));
        markedForDeletion.forEach(node => node.classList.remove('fileItem--markedForDeletion'));
        if (this.hasUploadWarning()) {
            this.uploadWarning = this.uploadWarning ?? renderNode(this.renderUploadWarning());
            this.headerNode.after(this.uploadWarning);
            const fileNode = this.fileList.querySelector('.fileItem');
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

    _onChange(event) {
        this.validator._errors = [];
        this._callOnChange(event);
        this.handleUploadWarning();
    }

    onSubmitSuccess() {
        this.reconcileListItems();
        this.handleUploadWarning();
    }

    reconcileListItems() {
        const uploadItems = this.uploadList.getItems().map(item => {
            delete item.icon;
            delete item.lblRemoveFile;
            return item;
        });
        this.clearUploads();
        if (this.allowMultiple()) {
            this.fileList.listResource.addItems(uploadItems);
        } else {
            this.fileList.listResource.setItems(uploadItems);
        }
    }

    _onFileSelectClick() {
        this.input?.click();
    }

    // #endregion
}

customElements.define('file-field', FileField);

export default FileField;

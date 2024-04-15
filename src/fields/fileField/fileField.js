/**
 * @typedef {import('./fileFieldInterface').FileFieldInterface} FileFieldInterface
 * @typedef {import('./components/fileItem/fileItemInterface.js').FileItemInterface} FileItemInterface
 */

import Field from '../field/field.js';
import { mergeObjects, renderNode } from '@arpadroid/tools';
import FileItem from './components/fileItem/fileItem.js';

const html = String.raw;
class FileField extends Field {
    _validations = [...super.getValidations()];

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
        return mergeObjects(super.getDefaultConfig(), {
            inputTemplate: html`
                <input is="file-field-input" />
                <div class="fileField__fileLists">{fileList} {uploadList}</div>
                {fileSelect}
            `,
            fileComponent: FileItem,
            fileTagName: 'file-item',
            uploadListLabel: this.i18n.common?.labels?.lblUploads,
            fileListLabel: this.i18n?.lblUploadedFiles,
            hasDropArea: true,
            hasInputMask: false,
            allowMultiple: false,
            extensions: [],
            inputAttributes: {
                type: 'file'
            }
        });
    }

    /**
     * Accessors.
     */

    addUpload(file) {
        return this.uploadList?.addItem({ file, icon: 'upload' });
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
        const { fileTagName } = this._config;
        return this._childNodes.filter(node => node?.tagName?.toLowerCase() === fileTagName);
    }

    hasDropArea() {
        const hasAttr = this.hasAttribute('has-drop-area');
        return (
            (hasAttr && this.getAttribute('has-drop-area') !== 'false') ||
            (!hasAttr && this._config.hasDropArea)
        );
    }

    hasUploadWarning() {
        return (
            !this.allowMultiple() &&
            this.input?.uploads.length > 0 &&
            this.fileList?.itemsNode?.children.length > 0
        );
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

    getFileComponent() {
        return this._config.fileComponent;
    }

    getUploadComponent() {
        return this._config.uploadComponent;
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

    /**
     * Rendering.
     */

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
                  <button is="arpa-button" icon="upload_file" class="fileField__selectButton">
                      ${this.i18n.lblAddFile}
                  </button>
              `;
    }

    renderUploadList(id = this.getHtmlId()) {
        const { uploadListLabel: heading = '' } = this._config;
        return html`
            <file-list id="${id}-uploadList" class="fileField__uploadList" heading="${heading}"></file-list>
        `;
    }

    renderFileList(id = this.getHtmlId()) {
        const { fileListLabel: heading = '' } = this._config;
        return html`
            <file-list id="${id}-fileList" class="fileField__fileList" heading="${heading}"></file-list>
        `;
    }

    /**
     * Initialization.
     */

    async _onInitialized() {
        super._onInitialized();
        await this.onReady();
        this.classList.add(!this.allowMultiple() ? 'fileField--single' : 'fileField--multiple');
        this._initializeFileList();
        this.uploadList = this.querySelector('.fileField__uploadList');
        this.dropArea = this.querySelector('drop-area');
        this.input = this.getInput();
        this.input.removeEventListener('change', this._onChange);
        this.input.addEventListener('change', this._onChange);
        this.fileSelectBtn = this.querySelector('.fileField__selectButton');
        this.fileSelectBtn?.addEventListener('click', this._onFileSelectClick);
        this.handleUploadWarning();
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
        return html`<warning-message
            i18n="modules.form.fields.file.msgFileOverwriteWarning"
            class="fileField__overwriteWarning"
            can-close
        ></warning-message> `;
    }

    _initializeFileList() {
        this.fileList = this.querySelector('.fileField__fileList');
        if (this.fileList) {
            const files = this.getFileNodes();
            this.fileList.addItemNodes(files);
        }
    }

    /**
     * Actions.
     */

    _onChange(event) {
        this.validator._errors = [];
        this._callOnChange(event);
        this.handleUploadWarning();
    }

    onSubmitSuccess() {
        this.clearUploads();
        this.handleUploadWarning();
    }

    _onFileSelectClick() {
        this.input?.click();
    }
}

customElements.define('file-field', FileField);

export default FileField;

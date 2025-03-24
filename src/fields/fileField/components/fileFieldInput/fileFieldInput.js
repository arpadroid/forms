/**
 * @typedef {import("../../fileField.js").default} FileField
 * @typedef {import("@arpadroid/ui").DropArea} DropArea
 */
import { defineCustomElement } from '@arpadroid/tools';
import FieldInput from '../../../field/components/fieldInput/fieldInput.js';

class FileFieldInput extends FieldInput {
    /** @type {File[]} */
    uploads = [];
    /** @type {File[]} */
    invalidUploads = [];
    /** @type {FileField | undefined} */
    field;

    _initialize() {
        super._initialize();
        this.bind('_onInputChange');
    }

    getUploads() {
        return this.uploads;
    }

    /**
     * Initializes the nodes.
     * @returns {Promise<boolean>}
     */
    async _initializeNodes() {
        await super._initializeNodes();
        const input = this.input;
        if (!input) {
            return false;
        }
        input.style.display = 'none';
        this.allowMultiple = this.field?.allowMultiple();
        if (this.allowMultiple) {
            input.setAttribute('multiple', '');
        }
        input.removeEventListener('change', this._onInputChange);
        input.addEventListener('change', this._onInputChange);
        this._initializeDropArea();
        return true;
    }

    async _initializeDropArea() {
        this.dropArea = /** @type {DropArea} */ (this.field?.querySelector('drop-area'));
        await customElements.whenDefined('drop-area');
        this.dropArea?.on('drop', this._onInputChange);
    }

    /**
     * Handles the change event for the input element.
     * @param {Event} event - The event object.
     * @param {FileList | null} _files - The files to process.
     */
    _onInputChange(event, _files = this.input?.files || null) {
        const files = Array.from(_files || []);
        if (!files?.length) {
            return;
        }
        const multiple = this.field?.allowMultiple();
        /** @type {File[]} */
        const invalidUploads = [];
        if (!multiple && !invalidUploads.length) {
            this.uploads = [];
            this.field?.clearUploads();
        }
        const uploads = files.filter(file => {
            const isValid = this.addUpload(file);
            if (!isValid) {
                invalidUploads.push(file);
            }
            return isValid;
        });
        if (uploads.length) {
            this.field?.signal('filesAdded', uploads, this);
        }
        if (invalidUploads.length) {
            this.field?.signal('error', invalidUploads, this);
        }

        this.field?.updateErrors();
    }

    /**
     * Adds a file to the uploads array.
     * @param {File} file - The file to add.
     * @returns {boolean} True if the file was added, false otherwise.
     */
    addUpload(file) {
        const isValid = this.field?.validator?.validateFile(file);
        if (isValid) {
            this.uploads.push(file);
            this.field?.addUpload(file);
        }
        return Boolean(isValid);
    }
}

defineCustomElement('file-field-input', FileFieldInput);

export default FileFieldInput;

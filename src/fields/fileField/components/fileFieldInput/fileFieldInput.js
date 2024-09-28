/**
 * @typedef {import("./interface/fieldInterface.js").FieldInterface} FieldInterface
 * @typedef {import("../../fileField.js").default} FileField
 */
import FieldInput from '../../../field/components/fieldInput/fieldInput.js';
import FileField from '../../fileField.js';
class FileFieldInput extends FieldInput {
    uploads = [];
    invalidUploads = [];
    /** @type {FileField} */
    field;
    constructor(config) {
        super(config);
        this._onInputChange = this._onInputChange.bind(this);
    }

    getUploads() {
        return this.uploads;
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.display = 'none';
        this.allowMultiple = this.field?.allowMultiple();
        if (this.allowMultiple) {
            this.setAttribute('multiple', '');
        }
        this.removeEventListener('change', this._onInputChange);
        this.addEventListener('change', this._onInputChange);
        this._initializeDropArea();
    }

    async _initializeDropArea() {
        this.dropArea = this.field?.querySelector('drop-area');
        await customElements.whenDefined('drop-area');
        this.dropArea?.on('drop', this._onInputChange);
    }

    _onInputChange(event, files = this.files) {
        files = Array.from(files);
        if (!files?.length) {
            return;
        }
        const multiple = this.field.allowMultiple();
        const invalidUploads = [];
        if (!multiple && !invalidUploads.length) {
            this.uploads = [];
            this.field.clearUploads();
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
        
        this.field.updateErrors();
    }

    addUpload(file) {
        const isValid = this.field.validator.validateFile(file);
        if (isValid) {
            this.uploads.push(file);
            this.field?.addUpload(file);
        }
        return isValid;
    }
}

customElements.define('file-field-input', FileFieldInput, { extends: 'input' });

export default FileFieldInput;

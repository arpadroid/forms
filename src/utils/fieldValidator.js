/**
 * @typedef {import("../components/fields/field/interface/fieldInterface").FieldInterface} FieldInterface
 * @typedef {import('../fields/field/field.js').default} Field
 */

import { formatBytes, getExtension, megaBytesToBytes, ucFirst } from '@arpadroid/tools';
import { validateMinLength, validateNumber, validateRegex, validateRequired } from '@arpadroid/tools';
import { validateColor, validateLength, validateMaxLength, validateSize } from '@arpadroid/tools';
import { I18nTool } from '@arpadroid/i18n';

const html = String.raw;
/**
 * Represents a field validator.
 */
class FieldValidator {
    /** @type {Field} */
    field;
    _methods = ['required', 'minLength', 'maxLength', 'size'];
    _errors = [];

    /**
     * Creates a new instance of FieldValidator.
     * @param {Field} field - The field to validate.
     */
    constructor(field) {
        /** @type {Field} */
        this.field = field;
        /** @type {FieldInterface} */
        this.config = this.field.getConfig();
    }

    /**
     * Sets an error message.
     * @param {string} error - The error message.
     */
    setError(error) {
        this._errors.push(error);
    }

    /**
     * Gets the errors.
     * @returns {string[]}
     */
    getErrors() {
        return [...this._errors];
    }

    /**
     * Checks if the field is valid.
     * @returns {boolean} - True if the field is valid, false otherwise.
     */
    isValid() {
        return this._errors?.length;
    }

    /**
     * Gets the validation methods.
     * @returns {string[]} - The validation methods.
     */
    getMethods() {
        return this.field.getValidations() ?? [];
    }

    /**
     * Validates the field value.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if the value is valid, false otherwise.
     */
    validate(value) {
        this.i18n = this.field.getI18n();
        this._errors = [];
        let valid = this.runValidationMethods(value);
        const customValidator = this.field.getCustomValidator();
        if (typeof customValidator === 'function' && customValidator(value, this) === false) {
            valid = false;
        }
        this.isValid = valid;
        return valid;
    }

    /**
     * Runs the validation methods.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if all validation methods pass, false otherwise.
     */
    runValidationMethods(value) {
        let isValid = true;
        for (const _method of this.getMethods()) {
            const method = this.getMethod(_method);
            if (typeof method === 'function') {
                const isFieldValid = method(value);
                if (!isFieldValid) {
                    isValid = false;
                }
                if (method === 'required' && !isFieldValid) {
                    break;
                }
            } else {
                // console.error('Method is not implemented', _method);
            }
        }
        return isValid;
    }

    /**
     * Gets the validation method.
     * @param {string | () => void} param - The validation method parameter.
     * @returns {undefined | (value) => boolean} - The validation method.
     */
    getMethod(param) {
        if (typeof param === 'function') {
            return param;
        }
        if (typeof param === 'string') {
            const fieldMethod = `validate${ucFirst(param)}`;
            if (typeof this.field[fieldMethod] === 'function') {
                return this.field[fieldMethod].bind(this.field);
            } else if (typeof this[param] === 'function') {
                return this[param].bind(this);
            }
        }
    }

    /**
     * Validates if the field is required.
     * @param {unknown} value - The value to validate.
     * @param {boolean} [report] - Indicates whether to report the error.
     * @returns {boolean} - True if the field is not required or the value is not empty, false otherwise.
     */
    required(value = this.field.getValue(), report = true) {
        const valid = !this.field.isRequired() || validateRequired(value);
        if (!valid && report) {
            const message = this.i18n.errRequired;
            this.setError(message);
        }
        return valid;
    }

    /**
     * Validates if the field value length is less than or equal to the specified maximum length.
     * @param {unknown} value - The value to validate.
     * @param {boolean} [report] - Indicates whether to report the error.
     * @returns {boolean} - True if the value length is less than or equal to the maximum length, false otherwise.
     */
    maxLength(value = this.field.getValue(), report = true) {
        const maxLength = this.field.getMaxLength();
        const valid = !maxLength || validateMaxLength(value, maxLength);
        if (!valid && report) {
            this.setError(this.i18n.errMaxLength.replace('{maxLength}', maxLength));
        }
        return valid;
    }

    minLength(value = this.field.getValue(), report = true) {
        const minLength = this.field.getMinLength();
        const valid = !minLength || validateMinLength(value, minLength);
        if (!valid && report) {
            this.setError(this.i18n.errMinLength.replace('{minLength}', minLength));
        }
        return valid;
    }

    /**
     * Validates if the field value length is equal to the specified length.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if the value length is equal to the specified length, false otherwise.
     */
    length(value = this.field.getValue()) {
        const length = this.field.getLength();
        const valid = validateLength(value, length);
        if (!valid) {
            this.setError(this.i18n.errLength.replace('{length}', length));
        }
        return valid;
    }

    /**
     * Validates if the field value size is equal to the specified size.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if the value size is equal to the specified size, false otherwise.
     */
    size(value = this.field.getValue()) {
        const size = this.field.getSize();
        const valid = validateSize(value, size);
        if (!valid) {
            this.setError(this.i18n.errSize.replace('{size}', size));
        }
        return valid;
    }

    /**
     * Validates if the field value matches the specified regular expression.
     * @param {unknown} value - The value to validate.
     * @param {RegExp} [regex] - The regular expression to match against.
     * @returns {boolean} - True if the value matches the regular expression, false otherwise.
     */
    regex(value = this.field.getValue(), regex = this.field.regex) {
        if (!regex || (this.field.isRequired() && !value)) {
            return true;
        }
        const valid = !regex || validateRegex(value, regex);
        const message = this.field?.regexMessage;
        if (!valid && message) {
            this.setError(message);
        }
        return valid;
    }

    /**
     * Validates if the field value is a number.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if the value is a number, false otherwise.
     */
    number(value = this.field.getValue()) {
        const valid = validateNumber(value);
        if (!valid) {
            this.setError(this.i18n.errNumber);
        }
        return valid;
    }

    /**
     * Validates if the field value is a valid color.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if the value is a valid color, false otherwise.
     */
    color(value = this.field.getValue()) {
        if (!value) {
            return true;
        }
        let valid = false;
        const textInput = this.field.textInput;
        if (textInput?.value?.length && validateColor(textInput.value)) {
            valid = true;
        }
        if (!valid) {
            this.setError(this.i18n.errColor);
        }
        return valid;
    }

    /**
     * Validates a file.
     * @param {File} file - The file to validate.
     * @returns {boolean} - True if the file is valid, false otherwise.
     */
    validateFile(file) {
        this.i18n = this.field.getI18n();
        let valid = true;
        if (!this.validateExtensions(file)) {
            valid = false;
        }
        if (!this.validateMaxSize(file)) {
            valid = false;
        }
        if (!this.validateMinSize(file)) {
            valid = false;
        }

        return valid;
    }

    /**
     * Validates if the file size is greater than or equal to the specified minimum size.
     * @param {File} file - The file to validate.
     * @param {number} [minSize] - The minimum size allowed.
     * @returns {boolean} - True if the file size is greater than or equal to the minimum size, false otherwise.
     */
    validateMinSize(file, minSize = this.field?.getMinSize()) {
        let valid = true;
        if (minSize) {
            const minBytes = megaBytesToBytes(minSize);
            if (file?.size < minBytes) {
                const message = I18nTool.processTemplate(this.i18n.errMinSize, {
                    file: html`<strong>${file.name}</strong>`,
                    size: html`<strong>${formatBytes(file.size, 0)}</strong>`,
                    minSize: html`<strong>${formatBytes(minBytes, 0)}</strong>`
                });
                this.setError(message);
                valid = false;
            }
        }
        return valid;
    }

    /**
     * Validates if the file extension is included in the specified extensions.
     * @param {File} file - The file to validate.
     * @param {string[]} [extensions] - The allowed extensions.
     * @returns {boolean} - True if the file extension is included in the extensions, false otherwise.
     */
    validateExtensions(file, extensions = this.field?.getExtensions()) {
        let valid = true;
        const extension = getExtension(file);
        if (extensions?.length && !extensions.includes(extension)) {
            valid = false;
            const message = I18nTool.processTemplate(this.i18n.errExtensions, {
                extensions: html`<span>${extensions.join(', ')}</span>`,
                size: html`<span>${formatBytes(file.size, 1)}</span>`,
                file: html`<span>${file.name}</span>`
            });
            this.setError(message);
        }
        return valid;
    }

    /**
     * Validates if the file size is less than or equal to the specified maximum size.
     * @param {File} file - The file to validate.
     * @param {number} [maxSize] - The maximum size allowed.
     * @returns {boolean} - True if the file size is less than or equal to the maximum size, false otherwise.
     */
    validateMaxSize(file, maxSize = this.field?.getMaxSize()) {
        let valid = true;
        if (maxSize) {
            const maxBytes = megaBytesToBytes(maxSize);
            if (file?.size > maxBytes) {
                const message = I18nTool.processTemplate(this.i18n.errMaxSize, {
                    file: html`<strong>${file.name}</strong>`,
                    size: html`<strong>${formatBytes(file.size, 1)}</strong>`,
                    maxSize: html`<strong>${formatBytes(maxBytes, 1)}</strong>`
                });
                this.setError(message);
                valid = false;
            }
        }
        return valid;
    }
}

export default FieldValidator;

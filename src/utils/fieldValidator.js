/**
 * @typedef {import("../fields/field/field.types").FieldConfigType} FieldConfigType
 * @typedef {import('../fields/field/field.js').default} Field
 * @typedef {import('../fields/fileField/fileField.js').default} FileField
 * @typedef {import('../fields/colorField/colorField.js').default} ColorField
 */

import { formatBytes, getExtension, megaBytesToBytes, ucFirst } from '@arpadroid/tools';
import { validateMinLength, validateNumber, validateRegex, validateRequired } from '@arpadroid/tools';
import { validateColor, validateLength, validateMaxLength, validateSize } from '@arpadroid/tools';

const html = String.raw;
/**
 * Represents a field validator.
 */
class FieldValidator {
    /** @type {Field} */
    field;
    /** @type {string[]} */
    _methods = ['required', 'minLength', 'maxLength', 'size'];
    /** @type {string[]} */
    _errors = [];

    /**
     * Creates a new instance of FieldValidator.
     * @param {Field} field - The field to validate.
     */
    constructor(field) {
        /** @type {Field} */
        this.field = field;
        /** @type {FieldConfigType} */
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
        return Boolean(this._errors?.length);
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
        this._errors = [];
        let valid = this.runValidationMethods(value);
        const customValidator = this.field.getCustomValidator();
        if (typeof customValidator === 'function' && customValidator(value, this.field) === false) {
            valid = false;
        }
        return valid;
    }

    /**
     * Runs the validation methods.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if all validation methods pass, false otherwise.
     */
    runValidationMethods(value) {
        let isValid = true;
        for (const _method of this.getMethods()) { // @ts-ignore
            const method = this.getMethod(_method);
            if (typeof method === 'function') {
                const isFieldValid = method(value);
                if (!isFieldValid) {
                    isValid = false;
                }
                // if (_method === 'required' && !isFieldValid) break;
            } else {
                // console.error('Method is not implemented', _method);
            }
        }
        return isValid;
    }

    /**
     * Gets the validation method.
     * @param {keyof FieldValidator & string  | ((value: unknown) => boolean)} param - The validation method parameter.
     * @returns {undefined | ((value: unknown) => boolean)} - The validation method.
     */
    getMethod(param) {
        if (typeof param === 'function') {
            return param;
        }
        if (typeof param === 'string') {
            const methodName = /** @type {keyof Field} */ (`validate${ucFirst(param)}`);
            const fieldMethod = this.field[methodName];
            const method = /** @type {(value: unknown) => boolean} */ (this[param]);
            if (typeof fieldMethod === 'function') {
                return fieldMethod.bind(this.field);
            } else if (typeof method === 'function') {
                return method.bind(this);
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
        !valid && report && this.setError(this.field.i18n('errRequired'));
        return valid;
    }

    /**
     * Validates the maxLength of the field value.
     * @param {string | number | unknown[]} value - The value to validate.
     * @param {boolean} [report] - Indicates whether to report the error.
     * @returns {boolean} - True if the value length is less than or equal to the maximum length, false otherwise.
     */
    maxLength(value = /** @type {string | number | unknown[]} */ (this.field.getValue()), report = true) {
        const maxLength = this.field.getMaxLength();
        const valid = !maxLength || validateMaxLength(value, maxLength);
        if (!valid && report) {
            this.setError(this.field.i18n('errMaxLength', { maxLength: String(maxLength) }));
        }
        return Boolean(valid);
    }

    /**
     * Validates the minLength of the field value.
     * @param {string | number | unknown[]} value - The value to validate.
     * @param {boolean} [report] - Indicates whether to report the error.
     * @returns {boolean} - True if the value length is greater than or equal to the minimum length, false otherwise.
     */
    minLength(value = /** @type {string | number | unknown[]} */ (this.field.getValue()), report = true) {
        const minLength = this.field.getMinLength();
        const valid = !minLength || validateMinLength(value, minLength);
        if (!valid && report) {
            this.setError(this.field.i18n('errMinLength', { minLength: String(minLength) }));
        }
        return Boolean(valid);
    }

    /**
     * Validates if the field value length is equal to the specified length.
     * @param {string | []} value - The value to validate.
     * @param {number} [length] - The length to compare against.
     * @returns {boolean} - True if the value length is equal to the specified length, false otherwise.
     */
    length(value = /** @type {string | []} */ (this.field.getValue()), length = this.field.getLength()) {
        const valid = validateLength(value, length);
        if (!valid) {
            this.setError(this.field.i18n('errLength', { length: String(length) }));
        }
        return Boolean(valid);
    }

    /**
     * Validates if the field value size is equal to the specified size.
     * @param {string | number} value - The value to validate.
     * @param {number[]} [size] - The size to compare against.
     * @returns {boolean} - True if the value size is equal to the specified size, false otherwise.
     */
    size(value = /** @type {string|number} */ (this.field.getValue()), size = this.field.getSize()) {
        console.log('value', value);
        const valid = validateSize(value, size);
        if (!valid) {
            this.setError(this.field.i18n('errSize', { minLength: String(size[0]), maxLength: String(size[1]) }));
        }
        return Boolean(valid);
    }

    /**
     * Validates if the field value matches the specified regular expression.
     * @param {unknown} value - The value to validate.
     * @param {RegExp} [regex] - The regular expression to match against.
     * @returns {boolean} - True if the value matches the regular expression, false otherwise.
     */
    regex(value = this.field.getValue(), regex = this.field.getProperty('regex')) {
        if (!regex || !String(value).trim()) {
            return true;
        }
        const valid = !regex || validateRegex(value, regex);
        const message = this.field?.getProperty('regex-message');
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
            this.setError(this.field.i18n('errNumber'));
        }
        return valid;
    }

    /**
     * Validates if the field value is a valid color.
     * @param {unknown} value - The value to validate.
     * @returns {boolean} - True if the value is a valid color, false otherwise.
     */
    color(value) {
        const field = /** @type {ColorField} */ (this.field);
        if (typeof value === 'undefined') {
            value = field.getValue();
        }
        if (!value) {
            return true;
        }
        let valid = false;
        const textInput = field.textInput;
        if (textInput?.value?.length && validateColor(textInput.value)) {
            valid = true;
        }
        if (!valid) {
            this.setError(this.field.i18n('errColor'));
        }
        return valid;
    }

    /**
     * Validates a file.
     * @param {File} file - The file to validate.
     * @returns {boolean} - True if the file is valid, false otherwise.
     */
    validateFile(file) {
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
    validateMinSize(file, minSize) {
        if (!minSize) {
            const field = /** @type {FileField} */ (this.field);
            minSize = field?.getMinSize();
        }
        let valid = true;
        if (minSize) {
            const minBytes = megaBytesToBytes(minSize);
            if (file?.size < minBytes) {
                const message = this.field.i18n('errMinSize', {
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
     * Validates if the file size is less than or equal to the specified maximum size.
     * @param {File} file - The file to validate.
     * @param {number} [maxSize] - The maximum size allowed.
     * @returns {boolean} - True if the file size is less than or equal to the maximum size, false otherwise.
     */
    validateMaxSize(file, maxSize) {
        if (!maxSize) {
            const field = /** @type {FileField} */ (this.field);
            maxSize = field?.getMaxSize();
        }
        let valid = true;
        if (maxSize) {
            const maxBytes = megaBytesToBytes(maxSize);
            if (file?.size > maxBytes) {
                const message = this.field.i18n('errMaxSize', {
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

    /**
     * Validates if the file extension is included in the specified extensions.
     * @param {File} file - The file to validate.
     * @param {string[]} [extensions] - The allowed extensions.
     * @returns {boolean} - True if the file extension is included in the extensions, false otherwise.
     */
    validateExtensions(file, extensions = []) {
        let valid = true;
        if (!extensions?.length) {
            const field = /** @type {FileField} */ (this.field);
            extensions = field.getExtensions();
        }
        const extension = getExtension(file);
        if (extensions?.length && !extensions.includes(extension)) {
            valid = false;
            const message = this.field.i18n('errExtensions', {
                extensions: html`<span>${extensions.join(', ')}</span>`,
                size: html`<span>${formatBytes(file.size, 1)}</span>`,
                file: html`<span>${file.name}</span>`
            });
            this.setError(message);
        }
        return valid;
    }
}

export default FieldValidator;

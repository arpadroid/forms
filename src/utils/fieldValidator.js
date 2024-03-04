/**
 * @typedef {import("../components/fields/field/interface/fieldInterface").FieldInterface} FieldInterface
 * @typedef {import('../components/fields/field/field.js').default} Field
 */

import {
    formatBytes,
    getExtension,
    megaBytesToBytes,
    ucFirst,
    validateColor,
    validateLength,
    validateMaxLength,
    validateMinLength,
    validateNumber,
    validateRegex,
    validateRequired,
    validateSize
} from '@arpadroid/tools';

class FieldValidator {
    /** @type {Field} */
    field;
    _methods = ['required', 'minLength', 'maxLength', 'size'];
    _errors = [];

    constructor(field) {
        this.field = field;
        this.config = this.field.getConfig();
    }

    setError(error) {
        this._errors.push(error);
    }

    getErrors() {
        return [...this._errors];
    }

    isValid() {
        return this._errors?.length;
    }

    getMethods() {
        return this.field.getValidations() ?? [];
    }

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

    required(value = this.field.getValue(), report = true) {
        const valid = !this.field.isRequired() || validateRequired(value);
        if (!valid && report) {
            const message = this.i18n.errRequired;
            this.setError(message);
        }
        return valid;
    }

    maxLength(value = this.field.getValue(), report = true) {
        const maxLength = this.field.getMaxLength();
        const valid = !maxLength ?? validateMaxLength(value, maxLength);
        if (!valid && report) {
            this.setError(this.i18n.errMaxLength.replace('{maxLength}', maxLength));
        }
        return valid;
    }

    minLength(value = this.field.getValue(), report = true) {
        const minLength = this.field.getMinLength();
        const valid = !minLength ?? validateMinLength(value, minLength);
        if (!valid && report) {
            this.setError(this.i18n.errMinLength.replace('{minLength}', minLength));
        }
        return valid;
    }

    length(value = this.field.getValue()) {
        const length = this.field.getLength();
        const valid = validateLength(value, length);
        if (!valid) {
            this.setError(this.i18n.errLength.replace('{length}', length));
        }
        return valid;
    }

    size(value = this.field.getValue()) {
        const size = this.field.getSize();
        const valid = validateSize(value, size);
        if (!valid) {
            this.setError(this.i18n.errSize.replace('{size}', size));
        }
        return valid;
    }

    regex(value = this.field.getValue(), regex = this.field.getRegex()) {
        if (!regex || (this.field.isRequired() && !value)) {
            return true;
        }
        const valid = !regex || validateRegex(value, regex);
        const config = this.field.getConfig();
        const message = config.validationMessages?.regex;
        if (message) {
            this.setError(message);
        }
        return valid;
    }

    number(value = this.field.getValue()) {
        const valid = validateNumber(value);
        if (!valid) {
            this.setError(this.i18n.errNumber);
        }
        return valid;
    }

    color(value = this.field.getValue()) {
        if (!value) {
            return true;
        }
        let valid = false;
        const textInput = this.field.node.querySelector('.colorInputComponent__textInput');
        if (textInput?.value?.length && validateColor(textInput.value)) {
            valid = true;
        }
        if (!valid) {
            this.setError(this.i18n.errColor);
        }
        return valid;
    }

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

    validateMinSize(file, minSize = this.field?.getMinSize()) {
        let valid = true;
        if (minSize) {
            const minBytes = megaBytesToBytes(minSize);
            if (file?.size < minBytes) {
                const messageNode = document.createElement('span');
                messageNode.innerHTML = this.i18n.errMinSize
                    .replace('{filename}', `<strong>${file.name}</strong>`)
                    .replace('{size}', `<strong>${formatBytes(file.size, 0)}</strong>`)
                    .replace('{minSize}', `<strong>${formatBytes(minBytes, 0)}</strong>`);
                this.setError(messageNode);
                valid = false;
            }
        }
        return valid;
    }

    validateExtensions(file, extensions = this.field?.getExtensions()) {
        let valid = true;
        const extension = getExtension(file);
        if (extensions?.length && !extensions.includes(extension)) {
            valid = false;
            const messageNode = document.createElement('span');
            messageNode.innerHTML = this.i18n.errExtensions
                .replace('{extensions}', `<strong>${extensions.join(', ')}</strong>`)
                .replace('{size}', `<strong>${formatBytes(file.size, 1)}</strong>`)
                .replace('{file}', `<strong>${file.name}</strong>`);
            this.setError(messageNode);
        }
        return valid;
    }

    validateMaxSize(file, maxSize = this.field?.getMaxSize()) {
        let valid = true;
        if (maxSize) {
            const maxBytes = megaBytesToBytes(maxSize);
            if (file?.size > maxBytes) {
                const messageNode = document.createElement('span');
                messageNode.innerHTML = this.i18n.errMaxSize
                    .replace('{filename}', `<strong>${file.name}</strong>`)
                    .replace('{size}', `<strong>${formatBytes(file.size, 1)}</strong>`)
                    .replace('{maxSize}', `<strong>${formatBytes(maxBytes, 1)}</strong>`);
                this.setError(messageNode);
                valid = false;
            }
        }
        return valid;
    }
}

export default FieldValidator;

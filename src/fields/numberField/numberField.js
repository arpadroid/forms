import { attr, validateNumber } from '@arpadroid/tools';
import Field from '../field/field.js';

/**
 * @typedef {import('./numberFIeldInterface.js').NumberFieldInterface} NumberFieldInterface
 */

/**
 * Represents a number input field.
 */
class NumberField extends Field {
    /**
     * Array of validations for the number field.
     * @type {string[]}
     * @protected
     */
    _validations = [...super.getValidations(), 'number'];

    /**
     * Returns the default configuration for the number field.
     * @returns {NumberFieldInterface} The default configuration object.
     * @protected
     */
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            icon: 'numbers',
            inputAttributes: {
                type: 'number'
            }
        };
    }

    /**
     * Returns the parsed numeric value of the field's input value.
     * @returns {number | undefined}
     * @protected
     */
    getValue() {
        const value = parseFloat(super.getValue());
        return isNaN(value) ? undefined : value;
    }

    /**
     * Initializes the input element of the number field.
     */
    _initializeInputNode() {
        super._initializeInputNode();
        attr(this.input, {
            min: this.getProperty('min'),
            max: this.getProperty('max'),
            step: this.getProperty('step')
        });
    }

    /**
     * Validates the number field value.
     * @returns {boolean} True if the value is valid, false otherwise.
     */
    validateNumber() {
        const value = this.getValue();
        if (!validateNumber(value)) {
            this.validator.setError('Invalid number');
            return false;
        }
        const min = this.getProperty('min');
        if (min && value < min) {
            this.validator.setError(`Value must be greater than ${min}`);
            return false;
        }
        const max = this.getProperty('max');
        if (max && value > max) {
            this.validator.setError(`Value must be greater than ${min}`);
            return false;
        }
        return true;
    }
}

customElements.define('number-field', NumberField);

export default NumberField;

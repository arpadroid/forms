import { mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';

/**
 * @typedef {import('../optionsField/optionsFieldInterface').OptionsFieldInterface} OptionsFieldInterface
 */

/**
 * Represents an array field that allows selecting multiple options.
 */
class ArrayField extends OptionsField {
    value = [];

    /**
     * Returns the default configuration for the array field.
     * @returns {OptionsFieldInterface} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'fieldComponent multiOptionsFieldComponent',
            value: []
        });
    }

    /**
     * Gets the current value of the array field.
     * @returns {*} The current value.
     */
    getValue() {
        return this.getCheckedInputs()?.value ?? this.value;
    }

    /**
     * Gets the checked inputs of the array field.
     */
    getCheckedInputs() {
        // abstract method
    }

    /**
     * Sets the checked inputs of the array field.
     */
    setChecked() {
        // abstract method
    }

    /**
     * Adds a value to the array field.
     * @param {unknown} value - The value to add.
     * @returns {ArrayField} The updated array field.
     */
    addValue(value) {
        if (!this.value) {
            this.value = [];
        }
        if (!this.value.includes(value)) {
            this.value.push(value);
            if (this._hasRendered) {
                this.setChecked(value);
            }
        }
        return this;
    }

    /**
     * Removes a value from the array field.
     * @param {unknown} value - The value to remove.
     * @returns {ArrayField} The updated array field.
     */
    removeValue(value) {
        this.value = this.value.filter(val => val !== value);
        if (this._hasRendered) {
            this.setChecked(value);
        }
        return this;
    }

    /**
     * Adds multiple values to the array field.
     * @param {Array} values - The values to add.
     * @returns {ArrayField} The updated array field.
     */
    addValues(values) {
        this.value = this.value.concat(values);
        if (this._hasRendered) {
            this.setChecked(this.value);
        }
        return this;
    }

    /**
     * Removes multiple values from the array field.
     * @param {Array} values - The values to remove.
     * @returns {ArrayField} The updated array field.
     */
    removeValues(values) {
        this.value = this.value.filter(val => !values.includes(val));
        if (this._hasRendered) {
            this.setChecked(this.value);
        }
        return this;
    }

    /**
     * Unchecks all values in the array field.
     * @returns {ArrayField} The updated array field.
     */
    uncheckAll() {
        this.value = [];
        if (this.isConnected) {
            this.setChecked(this.value);
            this._callOnChange();
        }
        return this;
    }

    /**
     * Checks all values in the array field, except for the specified exceptions.
     * @param {unknown[]} exceptions - The values to exclude from checking.
     * @returns {ArrayField} The updated array field.
     */
    checkAll(exceptions = []) {
        this.value = this.getOptions().map(option => option.getAttribute('value'));
        if (exceptions.length) {
            this.value = this.value.filter(value => !exceptions.includes(value));
        }
        if (this.isConnected) {
            this.setChecked(this.value);
            this._callOnChange();
        }
        return this;
    }

    /**
     * Toggles the checked state of all values in the array field.
     * @returns {ArrayField} The updated array field.
     */
    toggleAll() {
        if (this.value.length === this.getOptionCount()) {
            this.uncheckAll();
        } else {
            this.checkAll();
        }
        return this;
    }

    /**
     * Sets the value of the array field.
     * @param {unknown} value - The value to set.
     * @returns {ArrayField} The updated array field.
     */
    setValue(value) {
        this.value = value;
        if (this._hasRendered) {
            this.setChecked(value);
        }
        return this;
    }

    /**
     * Checks if the array field has a specific value.
     * @param {unknown} value - The value to check.
     * @returns {boolean} True if the value is present, false otherwise.
     */
    hasValue(value) {
        return this.value.includes(value);
    }
}

customElements.define('array-field', ArrayField);

export default ArrayField;

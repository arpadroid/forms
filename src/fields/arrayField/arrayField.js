/**
 * @typedef {import('../optionsField/optionsField.types').OptionsFieldConfigType} OptionsFieldConfigType
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';

/**
 * Represents an array field that allows selecting multiple options.
 */
class ArrayField extends OptionsField {
    /** @type {unknown[]} */
    value = [];

    ////////////////////////////
    // #region Initialization
    ////////////////////////////
    async _initializeValue() {
        const attrValue = this.getAttribute('value');
        if (attrValue) {
            this.setValue(attrValue.split(',').map(value => value.trim()));
        } else {
            super._initializeValue();
        }
    }
    // #endregion

    ////////////////////////////
    // #region Get
    ////////////////////////////

    /**
     * Returns the default configuration for the array field.
     * @returns {OptionsFieldConfigType} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            value: []
        });
    }

    getFieldType() {
        return 'array';
    }

    /**
     * Gets the current value of the array field.
     * @returns {unknown[]} The current value.
     */
    getValue() {
        return this.getCheckedInputs()?.map(input => input.value) ?? this.value;
    }

    /**
     * Gets the checked inputs of the array field.
     * @returns {HTMLInputElement[]}
     */
    getCheckedInputs() {
        return Array.from(this.querySelectorAll('input:checked'));
    }

    /**
     * Checks if the array field has a specific value.
     * @param {unknown} value - The value to check.
     * @returns {boolean} True if the value is present, false otherwise.
     */
    hasValue(value) {
        return this.value.includes(value);
    }

    // #endregion

    ////////////////////////////
    // #region Set
    ////////////////////////////

    /**
     * Sets the checked inputs of the array field.
     * @param {unknown} _value - The value to set.
     */
    setChecked(_value) {
        // abstract method
    }

    /**
     * Sets the value of the array field.
     * @param {unknown[]} value - The value to set.
     * @returns {this} The updated array field.
     */
    setValue(value) {
        this.value = value;
        if (this._hasRendered) {
            this.setChecked(value);
        }
        return this;
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
     * @param {unknown[]} values - The values to add.
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
     * @param {unknown[]} values - The values to remove.
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

    // #endregion
}

defineCustomElement('array-field', ArrayField);

export default ArrayField;

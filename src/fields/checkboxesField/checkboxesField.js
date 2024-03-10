import { mergeObjects } from '@arpadroid/tools';
import ArrayField from '../arrayField/arrayField.js';
const html = String.raw;

/**
 * @typedef {import('./checkboxesFieldInterface').CheckboxesFieldInterface} CheckboxesFieldInterface
 */

/**
 * Represents a group of checkboxes field.
 */
class CheckboxesField extends ArrayField {
    /**
     * Get the default configuration for the checkboxes field.
     * @returns {CheckboxesFieldInterface} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            optionTemplate: html`<checkbox-option role="option"></checkbox-option>`,
            hasLabelToggle: true
        });
    }

    /**
     * Event handler for when the checkboxes field is connected to the DOM.
     * @private
     */
    _onConnected() {
        super._onConnected();
        if (this.hasLabelToggle()) {
            this.label.addEventListener('click', () => {
                this.toggleAll();
            });
        }
    }

    /**
     * Check if the checkboxes field has label toggle.
     * @returns {boolean} True if the checkboxes field has label toggle, false otherwise.
     */
    hasLabelToggle() {
        return this.hasAttribute('label-toggle') || Boolean(this._config?.hasLabelToggle);
    }

    /**
     * Get all the input elements within the checkboxes field.
     * @returns {Array} An array of input elements.
     */
    getInputs() {
        return [...this.optionsNode.querySelectorAll(`input[name="${this.getId()}[]"]`)];
    }

    /**
     * Uncheck all the checkboxes within the checkboxes field.
     * @returns {CheckboxesField} The checkboxes field instance.
     */
    uncheckAll() {
        super.uncheckAll();
        this.getInputs().forEach(input => (input.checked = false));
        return this;
    }

    /**
     * Check all the checkboxes within the checkboxes field, except for the specified exceptions.
     * @param {Array} exceptions - An array of values to exclude from being checked.
     * @returns {CheckboxesField} The checkboxes field instance.
     */
    checkAll(exceptions = []) {
        super.checkAll(exceptions);
        this.getInputs().forEach(input => (input.checked = true));
        return this;
    }

    /**
     * Check if the checkboxes field is binary.
     * If the field is binary, it means the value returned to the form submit function will consist of a key-value pair object, 
     * which specifies whether each option is checked or not through a boolean.
     * @returns {boolean} True if the checkboxes field is binary, false otherwise.
     */
    isBinary() {
        return this.hasAttribute('binary') ?? this._config?.binary;
    }

    /**
     * Returns the output value when the form is submitted.
     * @param {Record<string, unknown>} values - An object to store the output values.
     * @returns {Record<string, unknown> | unknown[] | undefined} The output value for this field.
     */
    getOutputValue(values = {}) {
        const { mergeOutput } = this._config;
        if (!this.isBinary() && !mergeOutput) {
            return super.getOutputValue();
        }
        const val = this.getValue();
        const value = {};
        for (const [optionValue, option] of Object.entries(this._optionsByValue)) {
            value[optionValue] = val?.includes(option.value) ?? false;
        }
        if (mergeOutput) {
            for (const [key, checked] of Object.entries(value)) {
                values[key] = checked;
            }
            return;
        }
        return value;
    }
}

customElements.define('checkboxes-field', CheckboxesField);

export default CheckboxesField;

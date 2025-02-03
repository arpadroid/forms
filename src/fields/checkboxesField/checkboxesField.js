/**
 * @typedef {import('./checkboxesField.types').CheckboxesFieldConfigType} CheckboxesFieldConfigType
 */
import { mergeObjects } from '@arpadroid/tools';
import ArrayField from '../arrayField/arrayField.js';

class CheckboxesField extends ArrayField {
    /** @type {CheckboxesFieldConfigType} */
    // @ts-ignore
    _config = this._config;

    /////////////////////////////////////
    // #region Initialization
    /////////////////////////////////////

    /**
     * Creates an instance of the checkboxes field.
     * @param {CheckboxesFieldConfigType} config - The configuration for the checkboxes field.
     */
    constructor(config) {
        super(config);
        this.onLabelClick = this.onLabelClick.bind(this);
    }

    /**
     * Get the default configuration for the checkboxes field.
     * @returns {CheckboxesFieldConfigType} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            optionComponent: 'checkbox-option',
            hasLabelToggle: true,
            inputAttributes: { type: 'checkbox' }
        });
    }

    // #endregion Initialization

    /////////////////////////////////////
    // #region Get
    /////////////////////////////////////

    getFieldType() {
        return 'checkboxes';
    }

    getTagName() {
        return 'checkboxes-field';
    }

    /**
     * Get all the input elements within the checkboxes field.
     * @returns {HTMLInputElement[]} An array of input elements.
     */
    getInputs() {
        return /** @type {HTMLInputElement[]} */ ([
            ...(this.optionsNode?.querySelectorAll(`input[name="${this.getId()}[]"]`) ?? [])
        ]);
    }

    /**
     * Returns the output value when the form is submitted.
     * @param {Record<string, unknown>} values - An object to store the output values.
     * @returns {Record<string, unknown> | unknown[] | undefined | unknown} The output value for this field.
     */
    getOutputValue(values = {}) {
        const { mergeOutput = false } = (this._config = {});
        if (!this.isBinary() && !mergeOutput) {
            return super.getOutputValue(values);
        }
        const val = this.getValue();
        /** @type {Record<string, boolean>} */
        const value = {};
        this.getOptions().forEach(option => {
            const optionValue = String(option.getAttribute('value'));
            value[optionValue] = val?.includes(optionValue) ?? false;
        });
        // for (const [optionValue, option] of Object.entries(this._optionsByValue)) {
        //     value[optionValue] = val?.includes(option.value) ?? false;
        // }
        if (mergeOutput) {
            for (const [key, checked] of Object.entries(value)) {
                values[key] = checked;
            }
            return;
        }
        return value;
    }

    // #endregion Get

    /////////////////////////////////////
    // #region Is
    /////////////////////////////////////

    /**
     * Check if the checkboxes field is binary.
     * If the field is binary, it means the value returned to the form submit function will consist of a key-value pair object,
     * which specifies whether each option is checked or not through a boolean.
     * @returns {boolean} True if the checkboxes field is binary, false otherwise.
     */
    isBinary() {
        return this.hasAttribute('binary') ?? this._config?.binary;
    }
    // #endregion Is

    /////////////////////////////////////
    // #region Set
    /////////////////////////////////////

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
     * @param {unknown[]} exceptions - An array of values to exclude from being checked.
     * @returns {CheckboxesField} The checkboxes field instance.
     */
    checkAll(exceptions = []) {
        super.checkAll(exceptions);
        this.getInputs().forEach(input => (input.checked = true));
        return this;
    }

    // #endregion Set

    /////////////////////////////////////
    // #region Lifecycle
    /////////////////////////////////////

    /**
     * Event handler for when the checkboxes field is connected to the DOM.
     */
    _onConnected() {
        super._onConnected();
        this._handleLabelToggle();
    }

    // #endregion Lifecycle

    /////////////////////////////////////
    // #region Event Handlers
    /////////////////////////////////////

    _handleLabelToggle() {
        if (this.hasLabelToggle()) {
            this.label?.removeEventListener('click', this.onLabelClick);
            this.label?.addEventListener('click', this.onLabelClick);
        }
    }

    onLabelClick() {
        this.toggleAll();
    }

    // #endregion Event Handlers

    /**
     * Check if the checkboxes field has label toggle.
     * @returns {boolean} True if the checkboxes field has label toggle, false otherwise.
     */
    hasLabelToggle() {
        return this.hasAttribute('label-toggle') || Boolean(this._config?.hasLabelToggle);
    }
}

customElements.define(CheckboxesField.prototype.getTagName(), CheckboxesField);

export default CheckboxesField;

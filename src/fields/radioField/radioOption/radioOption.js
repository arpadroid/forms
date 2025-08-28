/**
 * @typedef {import('../../optionsField/fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('../../radioField/radioField.js').default} RadioField
 */
import FieldOption from '../../optionsField/fieldOption/fieldOption.js';
import { defineCustomElement } from '@arpadroid/tools';
import { processTemplate } from '@arpadroid/ui';

const html = String.raw;

/**
 * Represents a radio option for a radio field.
 */
class RadioOption extends FieldOption {
    /** @type {FieldOptionConfigType} */
    _config = this._config;
    /** @type {RadioField} */
    field = this.field;
    /**
     * Creates a new radio option.
     * @param {FieldOptionConfigType} config - The configuration of the radio option.
     */
    constructor(config) {
        super(config);
        this._onChange = this._onChange.bind(this);
    }

    /**
     * Returns the default configuration for the radio option.
     * @returns {FieldOptionConfigType} The default configuration.
     */
    getDefaultConfig() {
        return {
            template: html`<label class="fieldOption__handler buttonInput" for="{optionId}">${FieldOption.template}</label>`
        };
    }

    /**
     * Renders the input element for the radio option.
     * @param {string} [type] - The type of the input element.
     * @param {string} [name] - The name attribute of the input element.
     * @param {string} [optionId] - The id attribute of the input element.
     * @param {string} [value] - The value attribute of the input element.
     * @returns {string} The rendered input element.
     */
    renderInput(type = 'radio', name = this.field?.getId(), optionId = this.getOptionId(), value = this.getProperty('value')) {
        const checked = this.field?.getValue() === value ? 'checked' : '';
        const template = html`<input type="${type}" id="{optionId}" name="{name}" value="{value}" {checked} />`;
        return processTemplate(template, { name, optionId, value, checked }, this);
    }

    /**
     * Handles the change event of the radio option.
     * @param {Event} event
     * @param {boolean} [callOnChange] - Whether to call the onChange method of the field.
     */
    _onChange(event, callOnChange = true) {
        const { onChange } = this._config;
        /** @type {HTMLInputElement | null} */
        const input = /** @type {HTMLInputElement} */ (event?.target);
        const value = input?.value;
        const checked = input?.checked;
        if (typeof onChange === 'function' && callOnChange) {
            onChange(checked, {
                value,
                event,
                optionNode: this,
                field: this.field
            });
        }
        callOnChange && this.field?._callOnChange(event);
    }

    async _onConnected() {
        await this.field?.promise;
        super._onConnected();
        this.input = this.querySelector('input');
        if (this.input) {
            this.input.removeEventListener('change', this._onChange);
            this.input.addEventListener('change', this._onChange);
        }
    }
}

defineCustomElement('radio-option', RadioOption);

export default RadioOption;

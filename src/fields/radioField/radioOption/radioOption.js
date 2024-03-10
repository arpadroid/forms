import { processTemplate } from '@arpadroid/tools';
import FieldOption from '../../optionsField/fieldOption/fieldOption.js';
const html = String.raw;

/**
 * @typedef {import('../../optionsField/fieldOption/fieldOptionInterface.js').FieldOptionInterface} FieldOptionInterface
 */

/**
 * Represents a radio option for a radio field.
 */
class RadioOption extends FieldOption {
    /**
     * Returns the default configuration for the radio option.
     * @returns {FieldOptionInterface} The default configuration.
     */
    getDefaultConfig() {
        return {
            template: html`<label class="fieldOption__handler" for="{optionId}"> ${FieldOption.template} </label> `
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
    renderInput(type = 'radio', name = this.field.getId(), optionId = this.getOptionId(), value = this.getProperty('value')) {
        const template = html`<input type="${type}" id="{optionId}" name="{name}" value="{value}" />`;
        return processTemplate(template, { name, optionId, value });
    }

    /**
     * Handles the change event of the radio option.
     * @param {Event} event
     * @param {boolean} [callOnChange] - Whether to call the onChange method of the field.
     */
    _onChange(event, callOnChange = true) {
        if (callOnChange) {
            this.field._callOnChange(event);
        }
    }
}

customElements.define('radio-option', RadioOption);

export default RadioOption;

import RadioOption from '../../radioField/radioOption/radioOption.js';

/**
 * @typedef {import('../../optionsField/fieldOption/fieldOptionInterface.js').FieldOptionInterface} FieldOptionInterface
 */

/**
 * Represents a checkbox option.
 */
class CheckboxOption extends RadioOption {
    /**
     * Renders the input element for the checkbox option.
     * @returns {HTMLInputElement} The rendered input element.
     * @protected
     */
    renderInput() {
        const name = this.field.getId() + '[]';
        return super.renderInput('checkbox', name);
    }

    async _onConnected() {
        await super._onConnected();
        if (this.input && this.field) {
            this.input.checked = this.field?.hasValue(this.getAttribute('value'));
        }
    }

    /**
     * Handles the change event of the checkbox option.
     * @param {Event} event - The onChange event.
     * @param {boolean} [callOnChange] - Indicates whether to call the onChange callback.
     * @protected
     */
    _onChange(event, callOnChange = true) {
        const checked = event.target.checked;
        let value = event.target.value;
        if (value == Number(value)) {
            value = Number(value);
        }
        if (checked) {
            this.field.addValue(value);
        } else {
            this.field.removeValue(value);
        }
        super._onChange(event, callOnChange);
    }
}

customElements.define('checkbox-option', CheckboxOption);

export default CheckboxOption;

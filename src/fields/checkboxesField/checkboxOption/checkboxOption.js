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

    /**
     * Renders the checkbox option.
     * @protected
     */
    render() {
        super.render();
        this.input = this.querySelector('input');
        this.input.addEventListener('change', this._onChange.bind(this));
    }

    /**
     * Handles the change event of the checkbox option.
     * @param {Event} event - The onChange event.
     * @param {boolean} [callOnChange] - Indicates whether to call the onChange callback.
     * @protected
     */
    _onChange(event, callOnChange = true) {
        const { onChange } = this._config;
        let value = event.target.value;
        const checked = event.target.checked;
        if (typeof onChange === 'function' && callOnChange) {
            onChange(checked, {
                value,
                event,
                optionNode: this,
                field: this.field
            });
        }
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

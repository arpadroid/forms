/** @typedef {import('./selectField.types').SelectFieldConfigType} SelectFieldConfigType */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import OptionsField from '../optionsField/optionsField.js';
import Field from '../field/field.js';
const html = String.raw;

class SelectField extends OptionsField {
    /** @type {SelectFieldConfigType} */
    _config = this._config;
    /** @returns {SelectFieldConfigType} The default configuration object. */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            iconRight: 'keyboard_arrow_down',
            optionComponent: 'option'
        });
    }

    getFieldType() {
        return 'select';
    }

    $renderTemplate() {
        return html`
            ${Field.prototype.$renderTemplate.call(this)}
            <arpa-node
                tag="select"
                name="input"
                class-name="arpaField__input"
                is-content
                on-change="{_callOnChange}"
                value="{value}"
            ></arpa-node>
        `;
    }

    updateValue() {
        this.selectedOption = this.getSelectedOption();
    }
}

defineCustomElement('select-field', SelectField);

export default SelectField;

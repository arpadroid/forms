/**
 * @typedef {import('./weekField.types').WeekFieldConfigType} WeekFieldConfigType
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
import { I18n } from '@arpadroid/i18n';
const html = String.raw;
class WeekField extends TextField {
    /** @type {HTMLInputElement} */
    input = this.input;
    /** @type {WeekFieldConfigType} */
    _config = this._config;
    _validations = [...super.getValidations(), 'week'];

    getDefaultConfig() {
        /** @type {WeekFieldConfigType} */
        const config = {
            pickerLabel: I18n.getText('forms.fields.week.lblShowPicker'),
            inputType: 'week'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getFieldType() {
        return 'week';
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-zone name="inputMaskRhs">
                <icon-button
                    icon="date_range"
                    tooltip="{pickerLabel}"
                    tooltip-position="left "
                    variant="minimal"
                    on-click="{showPicker}"
                ></icon-button>
            </arpa-zone>
        `;
    }

    showPicker() {
        this.input.showPicker();
    }

    /**
     * Validates the week value.
     * @param {string} value - The value to validate.
     * @returns {boolean} True if the value is a valid week.
     */
    validateWeek(value) {
        const isValid = !value?.length || value.match(/^\d{4}-W\d{2}$/);
        if (!isValid) {
            this.setError(I18n.getText('forms.fields.week.errWeek'));
        }
        return Boolean(isValid);
    }
}

defineCustomElement('week-field', WeekField);

export default WeekField;

/**
 * @typedef {import('./timeField.types').TimeFieldConfigType} TimeFieldConfigType
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 */
import { mergeObjects, attr, timeStringToSeconds, defineCustomElement } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
import { I18n } from '@arpadroid/i18n';

const html = String.raw;
class TimeField extends TextField {
    /** @type {HTMLInputElement} */
    input = this.input;
    /** @type {TimeFieldConfigType} */
    _config = this._config;
    _validations = [...super.getValidations(), 'min', 'max'];

    /**
     * Returns the default configuration for the time field.
     * @returns {TimeFieldConfigType} The default configuration object.
     */
    getDefaultConfig() {
        /** @type {TimeFieldConfigType} */
        const config = {
            inputType: 'time',
            pickerLabel: I18n.getText('forms.fields.time.lblShowPicker')
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getI18nKey() {
        return 'forms.fields.time';
    }

    getFieldType() {
        return 'time';
    }

    async $onConnected() {
        super.$onConnected();
        const min = this.getProp('min');
        const max = this.getProp('max');
        this.input && attr(this.input, { min, max });
        return true;
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-zone name="inputMaskRhs">
                <icon-button
                    icon="schedule"
                    tooltip="{pickerLabel}"
                    tooltip-position="left"
                    variant="minimal"
                    on-click="{showPicker}"
                ></icon-button>
            </arpa-zone>
        `;
    }

    showPicker() {
        this.input?.showPicker();
    }

    /**
     * Validates the minimum time value.
     * @param {string} value - The time value to validate.
     * @returns {boolean} True if the value is valid, false otherwise.
     */
    validateMin(value) {
        const min = this.getProp('min');
        if (value && min) {
            const minSeconds = timeStringToSeconds(min);
            const seconds = timeStringToSeconds(value);
            if (seconds < minSeconds) {
                this.validator?.setError(
                    html`<i18n-text key="${this.getI18nKey()}.errMin" replacements="min::${min}"></i18n-text>`
                );
                return false;
            }
        }
        return true;
    }

    /**
     * Validates the maximum time value.
     * @param {string} value - The time value to validate.
     * @returns {boolean} True if the value is valid, false otherwise.
     */
    validateMax(value) {
        const max = this.getProp('max');
        if (value && max) {
            const maxSeconds = timeStringToSeconds(max);
            const seconds = timeStringToSeconds(value);
            if (seconds > maxSeconds) {
                this.validator?.setError(
                    html`<i18n-text key="${this.getI18nKey()}.errMax" replacements="max::${max}"></i18n-text>`
                );
                return false;
            }
        }
        return true;
    }
}

defineCustomElement('time-field', TimeField);

export default TimeField;

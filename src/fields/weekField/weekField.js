/**
 * @typedef {import('./weekField.types').WeekFieldConfigType} WeekFieldConfigType
 */
import { defineCustomElement, mergeObjects, renderNode } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
import { I18n } from '@arpadroid/i18n';
const html = String.raw;
class WeekField extends TextField {
    /** @type {HTMLInputElement} */ // @ts-ignore
    input = this.input;
    /** @type {WeekFieldConfigType} */ // @ts-ignore
    _config = this._config;

    _validations = [...super.getValidations(), 'week'];
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            pickerLabel: I18n.getText('forms.fields.week.lblShowPicker'),
            inputAttributes: { type: 'week' }
        });
    }

    getFieldType() {
        return 'week';
    }

    getTagName() {
        return 'week-field';
    }

    async _onInitialized() {
        await this.onReady();
        super._onInitialized();
        this.weekButton = this.renderWeekButton();
        this.inputMask?.addRhs('timeButton', this.weekButton);
    }

    renderWeekButton() {
        const { pickerLabel } = this._config;
        const button = renderNode(
            html`<button is="icon-button" icon="date_range" label="${pickerLabel}" tooltip-position="left "variant="minimal"></icon-button>`
        );
        button.addEventListener('click', () => this.input?.showPicker());
        return button;
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

defineCustomElement(WeekField.prototype.getTagName(), WeekField);

export default WeekField;

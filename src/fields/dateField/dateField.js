/** @typedef {import('./dateFieldInterface.js').DateFieldInterface} DateFieldInterface */
import { attr, formatDate, isAfter, isBefore, renderNode, mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
import { I18n } from '@arpadroid/i18n';
const html = String.raw;
class DateField extends Field {
    /** @type {string[]} _validations - The validation method signatures for the date field.*/
    _validations = [...super.getValidations(), 'date'];
    i18nKey = this.getI18nKey();
    //////////////////////////
    // #region INITIALIZATION
    //////////////////////////
    /**
     * Returns the default configuration for the date field.
     * @returns {DateFieldInterface} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            format: 'YYYY-MM-DD',
            inputFormat: 'YYYY-MM-DD',
            outputFormat: undefined,
            disableFuture: false,
            disablePast: false,
            inputAttributes: { type: 'date' }
        });
    }
    // #endregion
    //////////////////////
    // #region LIFECYCLE
    /////////////////////
    /**
     * Event handler for when the date field is connected to the DOM.
     * Renders the calendar button.
     * @protected
     */
    async _onConnected() {
        await this.onReady();
        super._onConnected();
        const min = this.getProperty('min');
        const max = this.getProperty('max');
        attr(this.input, { min, max });
        if (this.isFutureDisabled()) {
            this.input.setAttribute('max', formatDate(new Date(), this.getFormat()));
        }
        if (this.isPastDisabled()) {
            this.input.setAttribute('min', formatDate(new Date(), this.getFormat()));
        }
        if (!this.calendarButton) {
            this.calendarButton = this.renderCalendarButton();
            this.inputMask.addRhs('calendarButton', this.calendarButton);
        }
    }
    // #endregion
    //////////////////////
    // #region ACCESSORS
    /////////////////////
    getFieldType() {
        return 'date';
    }

    getTagName() {
        return 'date-field';
    }

    getI18nKey() {
        return 'modules.form.fields.date';
    }

    setValue(value, update = true) {
        const val = formatDate(value, this._config.inputFormat);
        return super.setValue(val, update);
    }

    getOutputValue() {
        const value = this.getValue();
        if (!value) {
            return value;
        }
        const format = this.getProperty('output-format') ?? this.getFormat();
        return formatDate(value, format);
    }

    /**
     * Checks if future dates are disabled for the date field.
     * @returns {boolean} True if future dates are disabled, false otherwise.
     */
    isFutureDisabled() {
        return this.hasAttribute('disable-future') || this._config.disableFuture;
    }

    /**
     * Checks if past dates are disabled for the date field.
     * @returns {boolean} True if past dates are disabled, false otherwise.
     */
    isPastDisabled() {
        return this.hasAttribute('disable-past') || this._config.disablePast;
    }

    /**
     * Gets the format of the date field.
     * @returns {string}
     */
    getFormat() {
        return this.getProperty('format');
    }

    /**
     * Shows the date picker for the date field.
     */
    showPicker() {
        try {
            this.input.showPicker();
        } catch (error) {
            // do nothing
        }
    }
    // #endregion
    //////////////////////
    // #region RENDER
    /////////////////////
    /**
     * Renders the calendar button for the date field.
     * @returns {HTMLButtonElement}
     */
    renderCalendarButton() {
        const label = I18n.getText(`${this.getI18nKey()}.txtShowPicker`);
        const buttonHTML = html`
            <button is="icon-button" label="${label}" variant="minimal" tooltip-position="left">
                calendar_month
            </icon-button>
        `;
        const button = renderNode(buttonHTML);
        button.addEventListener('click', () => this.showPicker());
        return button;
    }
    // #endregion
    //////////////////////
    // #region VALIDATION
    /////////////////////
    /**
     * Validates the date entered in the date field.
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    validateDate() {
        const value = this.input.value;
        if (this.isPastDisabled() && isBefore(value, new Date())) {
            this.validator.setError(html`<i18n-text key="${this.i18nKey}.errPastDisabled"></i18n-text>`);
            return false;
        }

        if (this.isFutureDisabled() && isAfter(value, new Date())) {
            this.validator.setError(html`<i18n-text key="${this.i18nKey}.errFutureDisabled"></i18n-text>`);
            return false;
        }
        const min = this.getProperty('min');
        const max = this.getProperty('max');
        if (min && isBefore(value, min)) {
            const minDate = formatDate(min, this.getFormat());
            this.validator.setError(
                html`<i18n-text key="${this.i18nKey}.errMinDate" replacements="date::${minDate}"></i18n-text>`
            );
            return false;
        }
        if (max && isBefore(max, value)) {
            const maxDate = formatDate(max, this.getFormat());
            this.validator.setError(
                html`<i18n-text key="${this.i18nKey}.errMaxDate" replacements="date::${maxDate}"></i18n-text>`
            );
            return false;
        }

        return true;
    }
    // #endregion
}

customElements.define(DateField.prototype.getTagName(), DateField);

export default DateField;

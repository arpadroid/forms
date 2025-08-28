/** @typedef {import('./dateField.types').DateFieldConfigType} DateFieldConfigType */
import { attr, formatDate, isAfter, isBefore, renderNode, mergeObjects, defineCustomElement } from '@arpadroid/tools';
import Field from '../field/field.js';
import { I18n } from '@arpadroid/i18n';
const html = String.raw;
class DateField extends Field {
    //////////////////////////////////
    // #region Initialization
    /////////////////////////////////

    /** @type {string[]} _validations - The validation method signatures for the date field.*/
    _validations = [...super.getValidations(), 'date'];
    i18nKey = this.getI18nKey();
    /** @type {DateFieldConfigType} */
    _config = this._config;
    /** @type {HTMLInputElement} */
    input = this.input;

    /**
     * Returns the default configuration for the date field.
     * @returns {DateFieldConfigType} The default configuration.
     */
    getDefaultConfig() {
        /** @type {DateFieldConfigType} */
        const config = {
            format: 'YYYY-MM-DD',
            inputFormat: 'YYYY-MM-DD',
            disableFuture: false,
            disablePast: false,
            inputAttributes: { type: 'date' }
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    // #endregion Initialization

    ////////////////////////////
    // #region LIFECYCLE
    ///////////////////////////

    async _initializeNodes() {
        await super._initializeNodes();
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
            this.calendarButton && this.inputMask?.addRhs('calendarButton', this.calendarButton);
        }
        return true;
    }

    // #endregion

    //////////////////////////////
    // #region Accessors
    /////////////////////////////

    getFieldType() {
        return 'date';
    }

    getTagName() {
        return 'date-field';
    }

    getI18nKey() {
        return 'forms.fields.date';
    }

    /**
     * Sets the value of the date field.
     * @param {string | Date} value
     * @param {boolean} [update]
     * @param {string} [format]
     * @returns {Field} The formatted value.
     */
    setValue(value, update = true, format = this._config?.inputFormat || this._config.format) {
        const val = formatDate(value, format);
        return super.setValue(val, update);
    }

    getOutputValue() {
        const value = super.getOutputValue();
        if (!value) return value;
        const format = this.getProperty('output-format') ?? this.getFormat();
        return formatDate(String(value), format);
    }

    /**
     * Checks if future dates are disabled for the date field.
     * @returns {boolean} True if future dates are disabled, false otherwise.
     */
    isFutureDisabled() {
        return Boolean(this.hasAttribute('disable-future') || this._config.disableFuture);
    }

    /**
     * Checks if past dates are disabled for the date field.
     * @returns {boolean} True if past dates are disabled, false otherwise.
     */
    isPastDisabled() {
        return Boolean(this.hasAttribute('disable-past') || this._config.disablePast);
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
            this.input?.showPicker();
        } catch (error) {
            console.error(error);
        }
    }

    // #endregion Accessors

    //////////////////////
    // #region Render
    /////////////////////

    /**
     * Renders the calendar button for the date field.
     * @returns {HTMLButtonElement | null}
     */
    renderCalendarButton() {
        const label = I18n.getText(`${this.getI18nKey()}.txtShowPicker`);
        const buttonHTML = html`
            <icon-button label="${label}" variant="minimal" tooltip-position="left"> calendar_month </icon-button>
        `;
        const button = /** @type {HTMLButtonElement | null} */ (renderNode(buttonHTML));
        button?.addEventListener('click', () => this.showPicker());
        return button;
    }

    // #endregion Render

    ////////////////////////////
    // #region Validation
    //////////////////////////

    /**
     * Validates the date entered in the date field.
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    validateDate() {
        const value = this.input?.value;
        if (this.isPastDisabled() && isBefore(value, new Date())) {
            this.validator?.setError(html`<i18n-text key="${this.i18nKey}.errPastDisabled"></i18n-text>`);
            return false;
        }

        if (this.isFutureDisabled() && isAfter(value, new Date())) {
            this.validator?.setError(html`<i18n-text key="${this.i18nKey}.errFutureDisabled"></i18n-text>`);
            return false;
        }
        const min = this.getProperty('min');
        const max = this.getProperty('max');
        if (min && isBefore(value, min)) {
            const minDate = formatDate(min, this.getFormat());
            this.validator?.setError(
                html`<i18n-text key="${this.i18nKey}.errMinDate" replacements="date::${minDate}"></i18n-text>`
            );
            return false;
        }
        if (max && isBefore(max, value)) {
            const maxDate = formatDate(max, this.getFormat());
            this.validator?.setError(
                html`<i18n-text key="${this.i18nKey}.errMaxDate" replacements="date::${maxDate}"></i18n-text>`
            );
            return false;
        }

        return true;
    }

    // #endregion Validation
}

defineCustomElement(DateField.prototype.getTagName(), DateField);

export default DateField;

import { attr, formatDate, isAfter, isBefore } from '@arpadroid/tools';
import { IconButton } from '@arpadroid/ui';
import Field from '../field/field.js';

/**
 * @typedef {import('./dateFieldInterface.js').DateFieldInterface} DateFieldInterface
 */

/**
 * Represents a date field.
 */
class DateField extends Field {
    /**
     * Array of validations for the date field.
     * @type {string[]}
     * @protected
     */
    _validations = [...super.getValidations(), 'date'];

    /**
     * Returns the default configuration for the date field.
     * @returns {DateFieldInterface} The default configuration.
     */
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            format: 'YYYY-MM-DD',
            outputFormat: undefined,
            disableFuture: false,
            disablePast: false,
            inputAttributes: {
                type: 'date'
            }
        };
    }

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

    /**
     * Renders the calendar button for the date field.
     * @returns {IconButton}
     */
    renderCalendarButton() {
        const button = new IconButton({
            icon: 'calendar_month',
            onClick: () => this.showPicker(),
            label: 'show date picker'
        });
        attr(button, { variant: 'minimal', 'tooltip-position': 'left' });
        return button;
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
     * Validates the date entered in the date field.
     * @returns {boolean} True if the date is valid, false otherwise.
     */
    validateDate() {
        const value = this.input.value;
        if (this.isPastDisabled() && isBefore(value, new Date())) {
            this.validator.setError('Past dates are not allowed');
            return false;
        }

        if (this.isFutureDisabled() && isAfter(value, new Date())) {
            this.validator.setError('Future dates are not allowed');
            return false;
        }
        const min = this.getProperty('min');
        const max = this.getProperty('max');
        if (min && isBefore(value, min)) {
            this.validator.setError(`Date must be after ${formatDate(min, this.getFormat())}`);
            return false;
        }
        if (max && isBefore(max, value)) {
            this.validator.setError(`Date must be before ${formatDate(max, this.getFormat())}`);
            return false;
        }

        return true;
    }

    getOutputValue() {
        const value = this.getValue();
        if (!value) {
            return value;
        }
        const format = this._config.outputFormat ?? this.getFormat();
        return formatDate(value, format);
    }
}

customElements.define('date-field', DateField);

export default DateField;

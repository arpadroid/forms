import DateField from '../dateField/dateField.js';

/**
 * @typedef {import('./dateFieldInterface.js').DateFieldInterface} DateFieldInterface
 */

/**
 * Represents a custom date and time field.
 */
class DateTimeField extends DateField {
    /**
     * Returns the default configuration for the DateTimeField.
     * @returns {Date} The default configuration object.
     */
    getDefaultConfig() {
        return {
            ...super.getDefaultConfig(),
            inputAttributes: { type: 'datetime-local' }
        };
    }

    /**
     * Renders the calendar button for the DateTimeField.
     * @returns {HTMLElement} The rendered calendar button element.
     */
    renderCalendarButton() {
        const button = super.renderCalendarButton();
        button.setAttribute('icon', 'calendar_clock');
        return button;
    }
}

customElements.define('date-time-field', DateTimeField);

export default DateTimeField;

/** @typedef {import('./dateFieldInterface.js').DateFieldInterface} DateFieldInterface */
import DateField from '../dateField/dateField.js';
import { mergeObjects } from '@arpadroid/tools';
class DateTimeField extends DateField {
    /**
     * Returns the default configuration for the DateTimeField.
     * @returns {Date} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'datetime-local' },
            inputFormat: 'YYYY-MM-DD HH:mm:ss',
            format: 'D MMM YYYY HH:MM',
            outputFormat: 'D MMM YYYY HH:MM'
        });
    }

    getFieldType() {
        return 'dateTime';
    }

    getTagName() {
        return 'date-time-field';
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

customElements.define(DateTimeField.prototype.getTagName(), DateTimeField);

export default DateTimeField;

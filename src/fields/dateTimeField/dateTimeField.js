/** @typedef {import('../dateField/dateField.types').DateFieldConfigType} DateFieldConfigType */
import DateField from '../dateField/dateField.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
class DateTimeField extends DateField {
    /**
     * Returns the default configuration for the DateTimeField.
     * @returns {DateFieldConfigType} The default configuration object.
     */
    getDefaultConfig() {
        /** @type {DateFieldConfigType} */
        const config = {
            inputAttributes: { type: 'datetime-local' },
            inputFormat: 'YYYY-MM-DD HH:mm:ss',
            format: 'D MMM YYYY HH:MM',
            outputFormat: 'D MMM YYYY HH:MM'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getFieldType() {
        return 'dateTime';
    }

    getTagName() {
        return 'date-time-field';
    }

    /**
     * Renders the calendar button for the DateTimeField.
     * @returns {HTMLButtonElement | null} The rendered calendar button element.
     */
    renderCalendarButton() {
        const button = super.renderCalendarButton();
        button?.setAttribute('icon', 'calendar_clock');
        return button;
    }
}

defineCustomElement(DateTimeField.prototype.getTagName(), DateTimeField);

export default DateTimeField;

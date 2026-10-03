/** @typedef {import('./dateTimeField.types').DateTimeFieldConfigType} DateTimeFieldConfigType */
import DateField from '../dateField/dateField.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
const html = String.raw;
class DateTimeField extends DateField {
    /**
     * Returns the default configuration for the DateTimeField.
     * @returns {DateTimeFieldConfigType} The default configuration object.
     */
    getDefaultConfig() {
        /** @type {DateTimeFieldConfigType} */
        const config = {
            inputType: 'datetime-local',
            inputFormat: 'YYYY-MM-DD HH:mm:ss',
            format: 'D MMM YYYY HH:MM',
            outputFormat: 'D MMM YYYY HH:MM'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getFieldType() {
        return 'dateTime';
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate().replace('calendar_month', 'calendar_clock')}
        `;
    }
}

defineCustomElement('date-time-field', DateTimeField);

export default DateTimeField;

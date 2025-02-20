import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import DateField from '../dateField/dateField.js';

class MonthField extends DateField {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            format: 'YYYY-MM',
            inputFormat: 'YYYY-MM',
            inputAttributes: { type: 'month' }
        });
    }

    getFieldType() {
        return 'month';
    }

    getTagName() {
        return 'month-field';
    }
}

defineCustomElement(MonthField.prototype.getTagName(), MonthField);

export default MonthField;

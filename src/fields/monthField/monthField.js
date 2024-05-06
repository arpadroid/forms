import { mergeObjects } from '@arpadroid/tools';
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

customElements.define(MonthField.prototype.getTagName(), MonthField);

export default MonthField;

import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';

class ResetField extends Field {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: {
                type: 'reset'
            }
        });
    }

    getFieldType() {
        return 'reset';
    }
}

defineCustomElement('reset-field', ResetField);

export default ResetField;

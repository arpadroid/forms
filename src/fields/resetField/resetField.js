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

    getTagName() {
        return 'reset-field';
    }

    _initializeProperties() {
        super._initializeProperties();
    }
}

defineCustomElement(ResetField.prototype.getTagName(), ResetField);

export default ResetField;

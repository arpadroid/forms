import { mergeObjects } from '@arpadroid/tools';
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

customElements.define('reset-field', ResetField);

export default ResetField;

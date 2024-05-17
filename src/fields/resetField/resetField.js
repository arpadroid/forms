import ObjectTool from '../../../../../utils/objectTool.js';
import Field from '../field/field.js';

class ResetField extends Field {
    getDefaultConfig() {
        return ObjectTool.merge(super.getDefaultConfig(), {
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

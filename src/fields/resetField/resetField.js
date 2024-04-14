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

    _initializeProperties() {
        super._initializeProperties();
    }
}
export default ResetField;

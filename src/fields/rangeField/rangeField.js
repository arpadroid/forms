import { mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';

class RangeField extends Field {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'range' }
        });
    }
}

customElements.define('range-field', RangeField);

export default RangeField;

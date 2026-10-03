import Field from '../field/field.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

const html = String.raw;
class HiddenField extends Field {
    /** @type {string[]} */
    _validations = [];

    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputType: 'hidden',
            inputTag: 'input'
        });
    }

    getFieldType() {
        return 'hidden';
    }

    $renderTemplate() {
        return html`<input type="hidden" value="{value}" id="{id}" name="{getId()}" can-render="!readOnly" />`;
    }
}

defineCustomElement('hidden-field', HiddenField);

export default HiddenField;

/** @typedef {import('./textArea.types').TextAreaConfigType} TextAreaConfigType */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import TextField from '../textField/textField.js';
class TextAreaField extends TextField {
    /**
     * @returns {TextAreaConfigType}
     */
    getDefaultConfig() {
        /** @type {TextAreaConfigType} */
        const config = {
            inputAttributes: { rows: 6, value: '' },
            inputTag: 'textarea',
            nodesConfig: {
                input: { attr: { value: undefined } }
            }
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getFieldType() {
        return 'textarea';
    }

    async $initialize() {
        this.value = this.innerHTML || this.getProp('value');
        super.$initialize();
    }
}

defineCustomElement('textarea-field', TextAreaField);

export default TextAreaField;

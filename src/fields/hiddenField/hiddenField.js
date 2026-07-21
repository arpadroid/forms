import Field from '../field/field.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

const html = String.raw;
class HiddenField extends Field {
    /** @type {string[]} */
    _validations = [];

    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'hidden' },
            template: html`{input}`
        });
    }

    getFieldType() {
        return 'hidden';
    }

    async $onConnected() {
        super.$onConnected();
        await this.onReady();
        if (this.isConnected) {
            this.input?.classList.add('arpaField');
            this.input && this.replaceWith(this.input);
        }
    }
}

defineCustomElement('hidden-field', HiddenField);

export default HiddenField;

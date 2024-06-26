import Field from '../field/field.js';
import { mergeObjects } from '@arpadroid/tools';

const html = String.raw;
class HiddenField extends Field {
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

    getTagName() {
        return 'hidden-field';
    }

    async _onConnected() {
        super._onConnected();
        await this.onReady();
        if (this.isConnected) {
            this.input.classList.add('arpaField');
            this.replaceWith(this.input);
        }
    }
}

customElements.define(HiddenField.prototype.getTagName(), HiddenField);

export default HiddenField;

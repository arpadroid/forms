import Field from '../field/field.js';
import { mergeObjects } from '@arpadroid/tools';

const html = String.raw;
/**
 * Represents a text field element.
 */
class HiddenField extends Field {
    _validations = [];

    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'hidden' },
            template: html`{input}`
        });
    }

    async _onConnected() {
        super._onConnected();
        await this.onReady();
        if (this.isConnected) {
            this.replaceWith(this.input);
        }
    }
}

customElements.define('hidden-field', HiddenField);

export default HiddenField;

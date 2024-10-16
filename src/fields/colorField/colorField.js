import { mergeObjects, stringToHex, validateColor } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

class ColorField extends Field {
    /** @type {string[]} _validations - The validation method signatures for the color field.*/
    _validations = [...super.getValidations(), 'color'];

    getDefaultConfig() {
        this.bind('updateColorInput', 'onInput');
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'color_lens',
            inputTemplate: html`
                <input id="{id}" type="text" class="fieldInput colorField__textInput" />
                <div class="colorField__colorInputWrapper">
                    <input class="colorField__colorInput" aria-labelledby="{id}-label" type="color" />
                </div>
            `,
            inputAttributes: { type: 'color' }
        });
    }

    getFieldType() {
        return 'color';
    }

    getTagName() {
        return 'color-field';
    }

    _initializeInputNode() {
        this.input = this.querySelector('input[type="color"]');
        this.input?.removeEventListener('input', this.onInput);
        this.input?.addEventListener('input', this.onInput);

        this.textInput = this.querySelector('input[type="text"]');
        if (this.textInput) {
            this.textInput.removeEventListener('keyup', this.updateColorInput);
            this.textInput.addEventListener('keyup', this.updateColorInput);
            this.textInput.value = this.getProperty('value') ?? '';
        }
        requestAnimationFrame(event => this.updateColorInput(event, false));
    }

    /**
     * Updates the color input based on the value of the text input.
     * @param {Event} event - The event that triggered the update.
     * @param {boolean} [callOnChange] - Whether to call the onChange method of the field.
     */
    updateColorInput(event, callOnChange = true) {
        const value = this.textInput?.value;
        const hexValue = stringToHex(value);
        const isValid = validateColor(hexValue);
        if (isValid) {
            this.input.value = hexValue;
        }
        if (callOnChange) {
            requestAnimationFrame(() => this._callOnChange(event));
        }
    }

    onInput() {
        this.textInput.value = this.input.value;
        this.textInput.value = this.input.value;
        this._callOnChange(event);
    }
}

customElements.define(ColorField.prototype.getTagName(), ColorField);

export default ColorField;

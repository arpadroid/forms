import { mergeObjects, stringToHex, validateColor } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

class ColorField extends Field {
    /** @type {string[]} _validations - The validation method signatures for the color field.*/
    _validations = [...super.getValidations(), 'color'];

    /**
     * Gets the default configuration for the color field.
     * @returns {import('../field/fieldInterface.js').FieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputTemplate: html`
                <input type="text" class="fieldInput colorField__textInput" />
                <div class="colorField__colorInputWrapper">
                    <input id="{id}" class="colorField__colorInput" type="color" />
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

    /**
     * Initializes the input elements of the color field.
     */
    _initializeInputNode() {
        this.input = this.querySelector('input[type="color"]');
        this.input.addEventListener('input', event => {
            this.textInput.value = this.input.value;
            this._callOnChange(event);
        });

        this.textInput = this.querySelector('input[type="text"]');
        this.textInput.addEventListener('keyup', this.updateColorInput.bind(this));
        this.textInput.value = this.getProperty('value') ?? '';
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
}

customElements.define('color-field', ColorField);

export default ColorField;

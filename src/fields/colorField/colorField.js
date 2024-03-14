import { mergeObjects, stringToHex, validateColor } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
const inputTemplate = html`
    <input type="text" class="fieldInput colorField__textInput" />
    <div class="colorField__colorInputWrapper">
        <input id="{id}" class="colorField__colorInput" type="color" />
    </div>
`;

/**
 * Represents a color field.
 */
class ColorField extends Field {
    /**
     * The validations for the color field.
     * @type {string[]}
     * @protected
     */
    _validations = [...super.getValidations(), 'color'];

    /**
     * Gets the default configuration for the color field.
     * @returns {import('../field/fieldInterface.js').FieldInterface} The default configuration object.
     * @protected
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputTemplate,
            inputAttributes: { type: 'color' }
        });
    }

    /**
     * Initializes the input elements of the color field.
     * @protected
     */
    _initializeInputNode() {
        /**
         * The color input element.
         * @type {HTMLInputElement}
         */
        this.input = this.querySelector('input[type="color"]');
        this.input.addEventListener('input', event => {
            this.textInput.value = this.input.value;
            this._callOnChange(event);
        });

        /**
         * The text input element.
         * @type {HTMLInputElement}
         */
        this.textInput = this.querySelector('input[type="text"');
        this.textInput.addEventListener('keyup', this.updateColorInput.bind(this));
        this.textInput.value = this.getProperty('value');
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
        } else {
            this.input.value = undefined;
        }
        if (callOnChange) {
            requestAnimationFrame(() => this._callOnChange(event));
        }
    }
}

customElements.define('color-field', ColorField);

export default ColorField;

import { mergeObjects, stringToHex, validateColor } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
const inputTemplate = html`
    <input type="text" class="fieldInput colorField__textInput" />
    <div class="colorField__colorInputWrapper">
        <input class="colorField__colorInput" type="color" />
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
     * Called when the color field is connected to the DOM.
     * @protected
     */
    connectedCallback() {
        super.connectedCallback();
    }

    /**
     * Initializes the input elements of the color field.
     * @protected
     */
    initializeInput() {
        /**
         * The color input element.
         * @type {HTMLInputElement}
         */
        this.input = this.querySelector('input[type="color"]');
        this.input.addEventListener('input', () => {
            this.textInput.value = this.input.value;
        });

        /**
         * The text input element.
         * @type {HTMLInputElement}
         */
        this.textInput = this.querySelector('input[type="text"');
        this.textInput.addEventListener('keyup', this.updateColorInput.bind(this));
        this.textInput.value = this.getProperty('value');
        requestAnimationFrame(() => this.updateColorInput());
    }

    /**
     * Updates the color input based on the value of the text input.
     */
    updateColorInput() {
        /**
         * The text input element.
         * @type {HTMLInputElement}
         */
        const value = this.textInput?.value;
        const hexValue = stringToHex(value);
        if (validateColor(hexValue)) {
            this.input.value = hexValue;
        } else {
            this.input.value = undefined;
        }
    }
}

customElements.define('color-field', ColorField);

export default ColorField;

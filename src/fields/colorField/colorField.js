import { defineCustomElement, mergeObjects, stringToHex, validateColor } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

class ColorField extends Field {
    /** @type {string[]} _validations - The validation method signatures for the color field.*/
    _validations = [...super.getValidations(), 'color'];

    getDefaultConfig() {
        this.bind('updateColorInput', 'onInput');
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'color_lens'
        });
    }

    getFieldType() {
        return 'color';
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-zone name="inputMaskRhs">
                <div class="colorField__colorInputWrapper">
                    <arpa-node
                        tag="input"
                        name="colorInput"
                        class="colorField__colorInput"
                        aria-labelledby="{id}-label"
                        on-input="{onInput}"
                        type="color"
                    />
                </div>
            </arpa-zone>
        `;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        await this.waitForArpaNodes();
        this.colorInput = /** @type {HTMLInputElement | null} */ (this.nodes.colorInput);
        this.textInput = /** @type {HTMLInputElement | null} */ (this.nodes.input);
        return true;
    }

    /**
     * Updates the color input based on the value of the text input.
     * @param {Event | undefined} event - The event that triggered the update.
     * @param {boolean} [callOnChange] - Whether to call the onChange method of the field.
     */
    updateColorInput(event, callOnChange = true) {
        const value = this.textInput?.value || '';
        const hexValue = stringToHex(value);
        const isValid = validateColor(hexValue);
        if (isValid) {
            this.colorInput && (this.colorInput.value = hexValue);
        }
        if (callOnChange) {
            requestAnimationFrame(() => this._callOnChange(event));
        }
    }

    getValue() {
        return this.colorInput?.value ?? '';
    }

    /** @param {Event | undefined} event */
    _callOnChange(event) {
        this.updateColorInput(event, false);
        super._callOnChange?.(event);
    }

    /**
     * Handles the input event of the color field.
     * @param {Event} event
     */
    onInput(event) {
        if (this.textInput && this.colorInput) {
            this.textInput.value = this.colorInput.value;
        }
        this._callOnChange(event);
    }
}

defineCustomElement('color-field', ColorField);

export default ColorField;

/** @typedef {import('./rangeField.types').RangeFieldConfigType} RangeFieldConfigType */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;

class RangeField extends Field {
    /** @returns {RangeFieldConfigType} */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputType: 'range',
            nodesConfig: {
                input: { className: 'rangeField__input' }
            }
        });
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <arpa-zone name="inputRhs">
                <arpa-node
                    name="textInput"
                    tag="input"
                    class="arpaField__input arpaField__input--compact rangeField__textInput"
                    id="{id}-text-input"
                    type="number"
                    min="{min}"
                    value="${this.getValue()}"
                    max="{max}"
                    step="{step}"
                    on-input="{_onTextInputChange}"
                />
            </arpa-zone>
        `;
    }

    /** @param {Event} event */
    _callOnChange(event) {
        super._callOnChange(event);
        if (this.textInput) {
            this.textInput.value = String(this.getValue());
        }
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        await this.waitForArpaNodes();
        this.textInput = /** @type {HTMLInputElement} */ (this.nodes.textInput);
        return true;
    }

    /**
     * Handles the change event of the text input.
     * @param {Event} event - The event object.
     */
    _onTextInputChange(event) {
        if (!this.textInput) return;
        const input = /** @type {HTMLInputElement} */ (event.target);
        const value = parseFloat(input.value);
        const max = parseFloat(this.textInput?.getAttribute('max') || '0');
        const min = parseFloat(this.textInput?.getAttribute('min') || '0');
        if (value > max) {
            this.textInput.value = String(max);
        } else if (value < min) {
            this.textInput.value = String(min);
        }
        if (!isNaN(value)) {
            this.setValue(value);
        }
    }

    getFieldType() {
        return 'range';
    }

    getValue() {
        const val = /** @type {string} */ (super.getValue());
        return parseFloat(val);
    }
}

defineCustomElement('range-field', RangeField);

export default RangeField;

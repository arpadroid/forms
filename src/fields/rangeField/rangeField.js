/** @typedef {import('./rangeField.types').RangeFieldConfigType} RangeFieldConfigType */
import { defineCustomElement, listen, mergeObjects } from '@arpadroid/tools';
import Field from '../field/field.js';
const html = String.raw;
class RangeField extends Field {
    /**
     * Creates an instance of RangeField.
     * @param {RangeFieldConfigType} config - The configuration object.
     */
    constructor(config) {
        super(config);
        this.bind('_onChange', '_onTextInputChange');
        this.on('change', this._onChange);
    }

    /**
     * Returns default config.
     * @returns {RangeFieldConfigType}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputAttributes: { type: 'range' },
            inputTemplate: html`<field-input
                {inputAttr}
                input-class="rangeField__input"
                value="{value}"
                min="{min}"
                max="{max}"
                step="{step}"
            >
            </field-input>`
        });
    }

    _onChange() {
        this.textInput && (this.textInput.value = String(this.getValue()));
    }

    renderInputRhs() {
        return this.renderChild('input-rhs', {
            content: html`<input
                class="fieldInput fieldInput--compact rangeField__textInput"
                id="{id}-text-input"
                type="number"
                min="{min}"
                max="{max}"
                step="{step}"
            />`,
            canRender: () => true
        });
    }

    /**
     * Returns the input template variables.
     * @returns {Record<string, unknown>}
     */
    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            min: this.getProperty('min'),
            max: this.getProperty('max'),
            step: this.getProperty('step'),
            value: this.getValue()
        };
    }

    async _initializeNodes() {
        await super._initializeNodes();
        this._initializeTextInput();
        return true;
    }

    _initializeTextInput() {
        /** @type {HTMLInputElement | null} */
        this.textInput = this.querySelector('.rangeField__textInput');
        if (!this.textInput) return true; // @ts-ignore
        this.textInput.value = String(this.input?.value);
        listen(this.textInput, 'input', this._onTextInputChange);
    }

    /**
     * Handles the change event of the text input.
     * @param {Event} event - The event object.
     */
    _onTextInputChange(event) {
        if (!this.textInput) return; // @ts-ignore
        const value = parseFloat(event.target?.value);
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

    getTagName() {
        return 'range-field';
    }

    getValue() {
        const val = /** @type {string} */ (super.getValue());
        return parseFloat(val);
    }
}

defineCustomElement(RangeField.prototype.getTagName(), RangeField);

export default RangeField;

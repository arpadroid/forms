/**
 * @typedef {import('./fieldInput.types.js').FieldInputConfigType} FieldInputConfigType
 */
import { ArpaElement } from '@arpadroid/ui';
import Field from '../../field.js';
import { attrString, defineCustomElement, mergeObjects } from '@arpadroid/tools';

const html = String.raw;
class FieldInput extends ArpaElement {
    _printAttributes() {
        super._printAttributes();
        /** @type {Record<string, unknown>} */
        this.inputAttributes = {};
        for (const attr of this.attributes) {
            this.inputAttributes[attr.name] = attr.value;
            this.removeAttribute(attr.name);
        }
    }

    /**
     * Returns the default configuration for the field input.
     * @returns {FieldInputConfigType}
     */
    getDefaultConfig() {
        /** @type {FieldInputConfigType} */
        const config = {
            inputAttributes: {},
            inputClass: 'fieldInput'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    _initializeField() {
        /** @type {Field | undefined} */
        this.field = this.field || this.closest('.arpaField') || undefined;
    }

    _preRender() {
        super._preRender();
        this._initializeField();
    }

    /**
     * Sets the value of the input element.
     * @param {string} value
     */
    setValue(value) {
        this.input && (this.input.value = value);
        this.input?.setAttribute('value', value);
    }

    canRenderInput() {
        return true;
    }

    $renderTemplate() {
        const field = this.field;
        return html`<arpa-node
            tag="input"
            name="input"
            class="{inputClass}"
            id="${field?.getHtmlId()}"
            name="${field?.getId()}"
            can-render="canRenderInput()"
            placeholder="${field?.getPlaceholder()}"
            value="${field?.getValue()?.toString()}"
            on-focus="{_onFocus}"
            on-input="{_onInput}"
            ${attrString(this.inputAttributes)}
        ></arpa-node>`;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        this.input = /** @type {HTMLInputElement | undefined} */ (this.nodes.input);
        return true;
    }

    /**
     * Handles the input event for the input element.
     * @param {Event} event
     */
    _onInput(event) {
        this.field?._callOnChange(event);
    }

    _onFocus() {
        this.field?._onFocus();
    }
}

defineCustomElement('field-input', FieldInput);

export default FieldInput;

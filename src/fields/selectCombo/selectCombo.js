import { mergeObjects } from '@arpadroid/tools';
import { InputCombo } from '@arpadroid/ui';
import SelectField from '../selectField/selectField.js';

/**
 * @typedef {import('../selectField/selectOption/selectOption.js').default} SelectOption
 * @typedef {import('../optionsField/optionsFieldInterface.js').OptionsFieldInterface} OptionsFieldInterface
 */

const html = String.raw;

/**
 * Represents a custom select combo field.
 */
class SelectCombo extends SelectField {
    /**
     * Returns the default configuration for the select combo field.
     * @returns {OptionsFieldInterface} The default configuration object.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            inputTemplate: html`
                {input} {button}
                <div class="selectCombo__options comboBox">{options}</div>
            `,
            optionTemplate: html`<select-option role="option"></select-option>`
        });
    }

    /**
     * Handles attribute changes and updates the value if the 'value' attribute has changed.
     * @param {string} name - The name of the attribute that changed.
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            this.updateValue();
        }
    }

    /**
     * Updates the value of the select combo field based on the selected option.
     */
    updateValue() {
        /** @type {SelectOption} */
        const selectedOption = this.getSelectedOption();
        if (selectedOption) {
            this.inputButton.textContent = selectedOption?.getProperty('label');
        }
    }

    /**
     * Returns the template variables for the input element of the select combo field.
     * @returns {Record<string, string>} The template variables object.
     */
    getInputTemplateVars() {
        return mergeObjects(super.getInputTemplateVars(), {
            // input: html``,
            button: html``
        });
    }

    /**
     * Initializes the properties of the select combo field.
     */
    initializeProperties() {
        super.initializeProperties();
        this.inputButton = this.querySelector('button.optionsField__input');
        this.optionsNode = this.querySelector('.selectCombo__options');
        customElements.whenDefined('select-option').then(() => {
            this.updateValue();
        });
    }

    /**
     * Renders the input element of the select combo field.
     * @returns {string} The rendered input element.
     */
    renderInput() {
        return html`<button type="button" class="optionsField__input fieldInput"></button>`;
    }

    /**
     * Event handler for when the select combo field is connected to the DOM.
     * Calls the necessary methods to initialize the input combo.
     * @protected
     */
    _onConnected() {
        super._onConnected();
        this._initializeInputCombo();
    }

    /**
     * Initializes the input combo for the select combo field.
     * @protected
     */
    _initializeInputCombo() {
        const handler = this.inputButton;
        if (handler) {
            this.inputCombo = new InputCombo(handler, this.optionsNode, {
                containerSelector: 'select-option',
            });
        }
    }
}

customElements.define('select-combo', SelectCombo);

export default SelectCombo;

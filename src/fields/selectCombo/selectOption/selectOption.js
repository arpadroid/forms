import { mergeObjects } from '@arpadroid/tools';
import FieldOption from '../../optionsField/fieldOption/fieldOption.js';
const html = String.raw;
/**
 * @typedef {import('../../optionsField/fieldOption/fieldOptionInterface.js').FieldOptionInterface} FieldOptionInterface
 * @typedef {import('../selectCombo.js').default} SelectCombo
 */

/**
 * Represents a select option element.
 */
class SelectOption extends FieldOption {
    /**
     * Creates a new SelectOption instance.
     * @param {FieldOptionInterface} config - The configuration object for the SelectOption.
     */
    constructor(config) {
        super(config);
        this._onSelected = this._onSelected.bind(this);
    }

    /**
     * Returns default config.
     * @returns {FieldOptionInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'comboBox__item',
            template: html`
                <button type="button" class="fieldOption__handler" data-value="{value}" tabindex="-1">
                    ${FieldOption.template}
                </button>
            `
        });
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            value: this.getProperty('value')
        };
    }

    /**
     * Called when the element is connected to the DOM.
     * @protected
     */
    _onConnected() {
        this.handler = this.querySelector('.fieldOption__handler');
        this.handler?.removeEventListener('click', this._onSelected);
        this.handler?.addEventListener('click', this._onSelected);
    }

    /**
     * Called when the element is selected.
     * @param {MouseEvent} event - The event object.
     */
    _onSelected(event) {
        this.field.setValue(this.getAttribute('value'));
        this.field._callOnChange(event);
        this.field?.inputCombo?.close();
    }
}

customElements.define('select-option', SelectOption);

export default SelectOption;

import { mergeObjects } from '@arpadroid/tools';
import FieldOption from '../../optionsField/fieldOption/fieldOption.js';
const html = String.raw;
/**
 * @typedef {import('../../optionsField/fieldOption/fieldOptionInterface.js').FieldOptionInterface} FieldOptionInterface
 */

/**
 * Represents a select option element.
 */
class SelectOption extends FieldOption {
    /**
     * Returns default config.
     * @returns {FieldOptionInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'comboBox__item',
            template: html`
                <button type="button" class="fieldOption__handler" for="{optionId}" tabindex="-1">
                    ${FieldOption.template}
                </button>
            `
        });
    }

    /**
     * Called when the element is connected to the DOM.
     * @protected
     */
    _onConnected() {
        this.handler = this.querySelector('.fieldOption__handler');
        this.handler?.addEventListener('click', this._onClick.bind(this));
    }

    /**
     * Called when the element is clicked.
     */
    _onClick() {
        this.field.setValue(this.getAttribute('value'));
    }
}

customElements.define('select-option', SelectOption);

export default SelectOption;

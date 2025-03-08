/**
 * @typedef {import('../../tagField.js').default} TagField
 * @typedef {import('./tagOption.types.js').TagOptionConfigType} TagOptionConfigType
 */
import { defineCustomElement } from '@arpadroid/tools';
import SelectOption from '../../../selectCombo/selectOption/selectOption.js';

class TagOption extends SelectOption {
    /** @type {TagOptionConfigType} */
    _config = this._config;
    /** @type {TagField} */
    field = this.field;

    /**
     * Handles the selected event.
     * @param {Event} event - The event object.
     */
    _onSelected(event) {
        event.stopImmediatePropagation();
        const button = this.querySelector('button');

        if (!button?.getAttribute('data-value')) {
            return;
        }
        const { value, label } = this._config;
        this.classList.add('selectComboOption--selected');
        this.field.addValue({ value, label });
        this.field._callOnChange(event);
        this.style.display = 'none';
        requestAnimationFrame(() => {
            this.focusNext();
            this.field?.inputCombo?.place();
        });
    }

    focusNext() {
        /** @type {HTMLElement | null} */
        const sibling = /** @type {HTMLElement | null} */ (this.nextSibling ?? this.previousSibling);
        const node = sibling?.querySelector('button') ?? this.parentNode;
        node instanceof HTMLElement && node?.focus();
    }
}

defineCustomElement('tag-option', TagOption);

export default TagOption;

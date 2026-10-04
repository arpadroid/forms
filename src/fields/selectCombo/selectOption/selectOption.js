/**
 * @typedef {import('../../optionsField/fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('../selectCombo.js').default} SelectCombo
 * @typedef {import('@arpadroid/ui').InputCombo} InputCombo
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import FieldOption from '../../optionsField/fieldOption/fieldOption.js';

/**
 * Represents a select option element.
 */
class SelectOption extends FieldOption {
    /** @type {SelectCombo} */
    field = this.field;

    getWrapperComponent() {
        return 'button';
    }

    getWrapperAttr() {
        return {
            ...super.getWrapperAttr(),
            type: 'button'
        };
    }

    /** @returns {FieldOptionConfigType} */
    getDefaultConfig() {
        this.field = /** @type {SelectCombo} */ (this.getField());
        this.onSelected = this.onSelected.bind(this);
        return mergeObjects(super.getDefaultConfig(), {
            className: 'comboBox__item',
            action: this.onSelected
        });
    }

    getField() {
        const parentNode = /** @type {HTMLElement & { InputCombo: InputCombo }} */ (this.parentNode);
        const field = super.getField() || parentNode?.InputCombo?.input?.closest('.arpaField');
        return field;
    }

    /**
     * Called when the element is selected.
     * @param {MouseEvent} event - The event object.
     */
    onSelected(event) {
        this.field = /** @type {SelectCombo} */ (this.getField());
        this.field?.onOptionSelected(this, event);
    }
}

defineCustomElement('select-option', SelectOption);

export default SelectOption;

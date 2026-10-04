/**
 * @typedef {import('../../optionsField/fieldOption/fieldOption.types').FieldOptionConfigType} FieldOptionConfigType
 * @typedef {import('../../radioField/radioField.js').default} RadioField
 */
import FieldOption from '../../optionsField/fieldOption/fieldOption.js';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

class RadioOption extends FieldOption {
    /** @type {FieldOptionConfigType} */
    _config = this._config;
    /** @type {RadioField} */
    field = this.field;

    /** @returns {FieldOptionConfigType} The default configuration. */
    getDefaultConfig() {
        /** @type {FieldOptionConfigType} */
        const config = {
            inputType: 'radio',
            inputTag: 'input'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getWrapperComponent() {
        return 'label';
    }
}

defineCustomElement('radio-option', RadioOption);

export default RadioOption;

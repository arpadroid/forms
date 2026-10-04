/**
 * @typedef {import('./fieldOptions.types').FieldOptionsConfigType} FieldOptionsConfigType
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import { List } from '@arpadroid/lists';
import FieldOption from '../fieldOption/fieldOption';

class FieldOptions extends List {
    /** @type {FieldOptionsConfigType} */
    _config = this._config;

    getDefaultConfig() {
        /** @type {FieldOptionsConfigType} */
        const config = {
            className: 'optionsField__options',
            itemComponent: FieldOption,
            renderMode: 'minimal',
            itemTag: 'field-option',
            attributes: {
                role: 'listbox'
            }
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }
}

export default FieldOptions;

defineCustomElement('field-options', FieldOptions);

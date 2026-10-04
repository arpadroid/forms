/**
 * @typedef {import('./selectOptions.types').SelectOptionsConfigType} SelectOptionsConfigType
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import FieldOptions from '../../optionsField/fieldOptions/fieldOptions';
import SelectOption from '../selectOption/selectOption';

class SelectOptions extends FieldOptions {
    /** @type {SelectOptionsConfigType} */
    _config = this._config;

    getDefaultConfig() {
        /** @type {SelectOptionsConfigType} */
        const config = {
            classNames: ['comboBox'],
            itemComponent: SelectOption,
            renderMode: 'minimal',
            itemTag: 'select-option',
            attributes: {
                role: 'listbox'
            }
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }
}

export default SelectOptions;

defineCustomElement('select-options', SelectOptions);

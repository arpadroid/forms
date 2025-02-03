import { FieldOptionConfigType } from '../checkboxesField/checkboxOption/checkboxOption';
import { OptionsFieldConfigType } from '../optionsField/optionsField.types';
import SelectField from './selectField';

export type SelectFieldConfigType = OptionsFieldConfigType & {
    onSelect?: (option: FieldOptionConfigType, field: SelectField) => unknown;
}

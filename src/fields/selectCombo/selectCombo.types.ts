import { FieldOptionConfigType } from '../optionsField/fieldOption/fieldOption.types';
import { FieldOption } from '../optionsField/optionsField';
import { SelectFieldConfigType } from '../selectField/selectField.types';

export type SelectComboConfigType = SelectFieldConfigType & {
    // preprocessInput?: (config: ButtonInterface, selectedOption: FieldOptionInterface) => void;
    // closeOnSelect?: boolean;
    // hasPager?: boolean;
    // onPageChange?: (page: number, event: Event) => void;
    hasSearch?: boolean;
    searchItemContentSelector?: '.fieldOption__label, .fieldOption__subTitle';
    debounceSearch?: number;
    renderOption?: (option: FieldOptionConfigType) => HTMLElement | string;
    renderValue?: (option?: FieldOption) => HTMLElement | string;
    optionsPosition?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'auto';
};

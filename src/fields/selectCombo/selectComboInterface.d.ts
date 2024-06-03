import { FieldOptionInterface } from "../optionsField/fieldOption/fieldOptionInterface";
import { SelectFieldInterface } from "../selectField/selectFieldInterface";


export interface SelectComboInterface extends SelectFieldInterface {
    // preprocessInput?: (config: ButtonInterface, selectedOption: FieldOptionInterface) => void;
    // closeOnSelect?: boolean;
    // hasPager?: boolean;
    // onPageChange?: (page: number, event: Event) => void;
    hasSearch?: boolean;
    searchItemContentSelector: '.fieldOption__label, .fieldOption__subTitle',
    debounceSearch?: number;
    renderOption?: (option: FieldOptionInterface) => HTMLElement | string;
    renderValue?: (option: FieldOptionInterface) => HTMLElement | string;
}

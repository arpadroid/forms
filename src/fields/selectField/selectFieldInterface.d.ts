import { OptionsFieldInterface } from '../optionsField/optionsFieldInterface';

export interface SelectFieldInterface extends OptionsFieldInterface {
    onSelect?: (option, field) => unknown;
}

import { OptionsFieldInterface } from '../optionsField/optionsFieldInterface';

export interface CheckboxesFieldInterface extends OptionsFieldInterface {
    hasLabelToggle?: boolean;
    binary?: boolean;
}

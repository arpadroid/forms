import { OptionsFieldConfigType } from '../optionsField/optionsField.types';

export type CheckboxesFieldConfigType = OptionsFieldConfigType & {
    hasLabelToggle?: boolean;
    binary?: boolean;
};

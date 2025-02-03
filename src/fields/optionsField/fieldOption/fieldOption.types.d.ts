import { ArpaElementConfigType } from '@arpadroid/ui/dist/@types/components/arpaElement/arpaElement.types';
import FieldOption from './fieldOption';
import OptionsField from '../optionsField';

export type FieldOptionOnChangePayloadType = {
    value: string;
    event: Event;
    optionNode: FieldOption;
    field?: OptionsField;
};

export type FieldOptionOnChangeType = (checked: boolean, payload: FieldOptionOnChangePayloadType) => void;

export type FieldOptionConfigType = ArpaElementConfigType & {
    label?: string;
    subTitle?: string;
    value?: string;
    disabled?: boolean;
    selected?: boolean;
    hidden?: boolean;
    tooltip?: string;
    icon?: string;
    iconLeft?: string;
    template?: string;
    className?: string;
    content?: string;
    onChange?: FieldOptionOnChangeType;
};

import FieldOption from './fieldOption.js';
import OptionsField from '../optionsField.js';
import { ListItemConfigType } from '@arpadroid/lists';

export type FieldOptionOnChangePayloadType = {
    value: string;
    event: Event;
    optionNode: FieldOption;
    field?: OptionsField;
};

export type FieldOptionOnChangeType = (checked: boolean, payload: FieldOptionOnChangePayloadType) => void;

export type FieldOptionConfigType = Omit<ListItemConfigType, 'title'> & {
    label?: string;
    value?: string;
    inputType?: string;
    disabled?: boolean;
    selected?: boolean;
    inputTag?: string;
    hidden?: boolean;
};

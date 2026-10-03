import { FieldConfigType } from '../field/field.types';

export type TimeFieldConfigType = FieldConfigType & {
    pickerLabel?: string;
    min?: string;
    max?: string;
};

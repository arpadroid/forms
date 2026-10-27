import { FieldConfigType } from '../field/field.types';

export type NumberFieldConfigType = FieldConfigType & {
    min?: number | string;
    max?: number | string;
    step?: number | string;
    enforceValue?: boolean;
};

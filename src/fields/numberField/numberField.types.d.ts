import { FieldConfigType } from '../field/field.types';

export type NumberFieldConfigType = FieldConfigType & {
    min?: number;
    max?: number;
    step?: number;
    enforceValue?: boolean;
};

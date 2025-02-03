import { FieldConfigType } from '../field/field.types';

export type NumberFieldConfigType = FieldConfigType & {
    step?: number;
};

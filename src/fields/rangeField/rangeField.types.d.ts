import { FieldConfigType } from '../field/field.types';

export type RangeFieldConfigType = FieldConfigType & {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
}

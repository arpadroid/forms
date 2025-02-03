import { FieldConfigType } from '../field/field.types';

export type TextAreaConfigType = FieldConfigType & {
    hasRichText?: boolean;
    rows?: number;
};

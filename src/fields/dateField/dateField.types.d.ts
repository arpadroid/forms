import { FieldConfigType } from '../field/field.types';

export type DateFieldConfigType = FieldConfigType & {
    disableFuture?: boolean;
    disablePast?: boolean;
    min?: string | Date;
    max?: string | Date;
    format?: string;
    inputFormat?: string;
    outputFormat?: string;
};

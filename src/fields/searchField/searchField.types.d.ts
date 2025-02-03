import { FieldConfigType } from '../field/field.types';

export type SearchFieldConfigType = FieldConfigType & {
    onSubmit?: (value?: string, event?: Event) => void;
};

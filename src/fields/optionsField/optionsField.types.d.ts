import { FieldConfigType } from '../field/field.types';
import { FieldOptionConfigType } from './fieldOption/fieldOption.types';
import OptionsField from './optionsField';

export type OptionsFieldConfigType = FieldConfigType & {
    autoFetchOptions?: boolean;
    fetchOptions?: (query: string, page: number | undefined, field: OptionsField) => Promise<FieldOptionConfigType[]>;
    hasInput?: boolean;
    optionComponent?: string;
    options?: FieldOptionConfigType[];
    optionTemplate?: string;
    defaultOption?: string;
};

export type OptionsNodeType = HTMLElement & { field?: OptionsField };

import { FieldInterface } from '../field/fieldInterface';
import { FieldOptionInterface } from './fieldOption/fieldOptionInterface';

export interface OptionsFieldInterface extends FieldInterface {
    autoFetchOptions?: boolean;
    fetchOptions?: (query, page) => Promise<Response>;
    hasInput?: boolean;
    optionComponent?: string;
    options?: FieldOptionInterface[];
    optionTemplate?: string;
}
